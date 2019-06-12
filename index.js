const dotenv = require('dotenv');
dotenv.config();
const Forecast = require('forecast-promise');
const { DateTime } = require('luxon');
const forecast = new Forecast({
    accountId: process.env.ID,
    token: process.env.TOKEN
});
const { table } = require('table');
const projectList = {};
const me = process.env.USER_ID;
const dt = DateTime.local();
const start = dt.startOf('week');
const end = dt.endOf('week');
const today = dt.weekday;
var options = {
    startDate: start.toISO(),
    endDate: end.toISO()
};
const days = {
    monday: start,
    thuesday: start.plus({ days: 1 }),
    wednesday: start.plus({ days: 2 }),
    thursday: start.plus({ days: 3 }),
    friday: start.plus({ days: 4 })
}
const colors = {
    Reset: "\x1b[0m",
    Bright: "\x1b[1m",
    Dim: "\x1b[2m",
    Underscore: "\x1b[4m",
    Blink: "\x1b[5m",
    Reverse: "\x1b[7m",
    Hidden: "\x1b[8m",

    FgBlack: "\x1b[30m",
    FgRed: "\x1b[31m",
    FgGreen: "\x1b[32m",
    FgYellow: "\x1b[33m",
    FgBlue: "\x1b[34m",
    FgMagenta: "\x1b[35m",
    FgCyan: "\x1b[36m",
    FgWhite: "\x1b[37m",

    BgBlack: "\x1b[40m",
    BgRed: "\x1b[41m",
    BgGreen: "\x1b[42m",
    BgYellow: "\x1b[43m",
    BgBlue: "\x1b[44m",
    BgMagenta: "\x1b[45m",
    BgCyan: "\x1b[46m",
    BgWhite: "\x1b[47m",
}

function colorize(text, color) {
    return colors[color] + text + colors.Reset;
}

const data = [
    [
        'Project',
        colorize('M', today === 1 ? 'FgGreen' : 'FgRed'),
        colorize('T', today === 2 ? 'FgGreen' : 'FgRed'),
        colorize('W', today === 3 ? 'FgGreen' : 'FgRed'),
        colorize('T', today === 4 ? 'FgGreen' : 'FgRed'),
        colorize('F', today === 5 ? 'FgGreen' : 'FgRed'),
    ],
];

forecast.projects().then(projects => {
    projects.forEach(project => projectList[project.id] = project.name);
    forecast.assignments(options).then(assignments => {
        const myTasks = assignments.filter(a => a.person_id == me);
        myTasks.forEach(task => {
            const taskStart = DateTime.fromISO(task.start_date);
            const taskEnd = DateTime.fromISO(task.end_date);
            const monday = days.monday >= taskStart && days.monday <= taskEnd ? colorize(task.allocation / 3600, 'FgCyan') : 0;
            const thuesday = days.thuesday >= taskStart && days.thuesday <= taskEnd ? colorize(task.allocation / 3600, 'FgCyan') : 0;
            const wednesday = days.wednesday >= taskStart && days.wednesday <= taskEnd ? colorize(task.allocation / 3600, 'FgCyan') : 0;
            const thursday = days.thursday >= taskStart && days.thursday <= taskEnd ? colorize(task.allocation / 3600, 'FgCyan') : 0;
            const friday = days.friday >= taskStart && days.friday <= taskEnd ? colorize(task.allocation / 3600, 'FgCyan') : 0;
            data.push([colorize(projectList[task.project_id], 'FgYellow'), monday, thuesday, wednesday, thursday, friday]);
        });
        console.log(table(data));
    });
});

