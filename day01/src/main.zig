const std = @import("std");

pub fn main() !u8 {
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    const allocator = gpa.allocator();

    var left = std.ArrayList(i32).init(allocator);
    var right = std.ArrayList(i32).init(allocator);
    var distances: i32 = 0;

    var file = try std.fs.cwd().openFile("inputs.txt", .{});
    defer file.close();

    var buf_reader = std.io.bufferedReader(file.reader());
    var in_stream = buf_reader.reader();

    var buf: [1024]u8 = undefined;

    while (try in_stream.readUntilDelimiterOrEof(&buf, '\n')) |line| {
        var parts = std.mem.splitSequence(u8, line, "   ");
        const first = std.fmt.parseInt(i32, parts.first(), 10) catch {
            std.debug.print("Failed to parse first number", .{});
            return 1;
        };

        const second = std.fmt.parseInt(i32, parts.next().?, 10) catch {
            std.debug.print("Failed to parse first number", .{});
            return 1;
        };

        try left.append(first);
        try right.append(second);
    }

    var similarity: i32 = 0;
    for (left.items) |x| {
        var n: i32 = 0;
        for (right.items) |y| {
            if (x == y) n += 1;
        }

        similarity += x * n;
    }

    std.debug.print("Similarity: {}\n", .{similarity});

    std.mem.sort(i32, left.items, {}, std.sort.desc(i32));
    std.mem.sort(i32, right.items, {}, std.sort.desc(i32));

    while (left.items.len != 0 and right.items.len != 0) {
        const x = left.popOrNull().?;
        const y = right.popOrNull().?;
        distances += if (x - y > 0) x - y else y - x;
    }

    std.debug.print("Distances: {}\n", .{distances});
    return 0;
}
