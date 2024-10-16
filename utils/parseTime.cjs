function parseTime (time) {
    let nums = time.split(" ");
    var t = nums[0].split(":");
    t.pop();
    return `${t}${nums[1]}`
}

module.exports = parseTime;