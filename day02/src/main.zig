const std = @import("std");

pub fn main() !u8 {
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    const allocator = gpa.allocator();

    var file = try std.fs.cwd().openFile("inputs.txt", .{});
    defer file.close();

    var buf_reader = std.io.bufferedReader(file.reader());
    var in_stream = buf_reader.reader();

    var buf: [1024]u8 = undefined;
    var safe: i32 = 0;
    var tolerate: i32 = 0;

    while (try in_stream.readUntilDelimiterOrEof(&buf, '\n')) |line| {
        var parts = std.mem.splitSequence(u8, line, " ");
        var report = std.ArrayList(i32).init(allocator);
        defer report.deinit();

        while (parts.next()) |part| {
            const number = std.fmt.parseInt(i32, part, 10) catch {
                std.debug.print("Failed to parse first number", .{});
                return 1;
            };

            try report.append(number);
        }

        if (validate(report)) {
            safe += 1;
        }

        for (0..report.items.len) |index| {
            var something: std.ArrayList(i32) = try report.clone();
            defer something.deinit();

            _ = something.orderedRemove(index);
            if (validate(something)) {
                tolerate += 1;
                break;
            }
        }
    }

    std.debug.print("Valid reports: {}\n", .{safe});
    std.debug.print("Tolerate reports: {}\n", .{tolerate});
    return 0;
}

pub fn validate(report: std.ArrayList(i32)) bool {
    if (report.items.len < 2) {
        return false;
    }

    const first = report.items[0];
    const second = report.items[1];

    if (first == second) {
        return false;
    }

    if (first - second < -3 or first - second > 3) {
        return false;
    }

    var difference: i32 = first - second;

    var prev: ?i32 = null;
    for (report.items[1..]) |current| {
        if (prev) |previous| {
            if (difference < 0 and previous - current > 0) {
                return false;
            }

            if (difference > 0 and previous - current < 0) {
                return false;
            }

            if (previous == current) {
                return false;
            }

            if (previous - current < -3 or previous - current > 3) {
                return false;
            }

            difference = previous - current;
        }

        prev = current;
    }

    return true;
}
