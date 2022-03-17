const nRunner = 2;
const updateDistance = (runnerDistance, prevDistance) => {return prevDistance + runnerDistance};
const updateRunnerDistance = (speed, distance) => { return speed * distance };
const updateRunnerTime = (runnerTime, interval) => { return runnerTime + Math.round((interval/1000)) };
const hasFinished = (distanceToComplete, currentDistance) => {return currentDistance >= distanceToComplete};
const printResults = (team, time, lastRunner) => console.log(`Team ${team.toUpperCase()} finished! \n ${lastRunner} crossed the finish line in ${time} seconds!`) 
const printProgress = (team, name, speed, distance, elapsedTime) => console.log(team + ' - current runner is:' + name + '\n running at a speed of ' + speed + 'm/s \n Total Distance Covered: ' + distance + ' Time: ' + elapsedTime);
const speedBoost = (type) => type === 'turtle' ? Math.round(20 * Math.random()) : 0; 
const createTeam = (nRunner,type,speed,speedBoostFn) =>  new Array(nRunner).fill().map((e, i) => {
    return { 
        type: type,
        name: type + ' ' + i,
        speed: speed + speedBoostFn(type)
    }
});
const teamRabbit = createTeam(nRunner, 'rabbit', 10, speedBoost);
const teamTurtle = createTeam(nRunner, 'turtle', 1, speedBoost);
const allTeams = [teamRabbit, teamTurtle]
function race(interval, distance,teamArr = [], hasFinishedCheck, printResultFn, printProgressFn, updateDistanceFn, updateRunnerDistanceFn, updateRunnerTimeFn, startTime = new Date()){
    const baseTime = Number(startTime);
    const team = teamArr;
    const completeDistance = team.length * distance;
    const raceLogic = (runner,prevDistance,runnerTime) => {
        const elapsedTime = Math.round((new Date - baseTime) / 1000);
        const updatedRunnerTime = updateRunnerTimeFn(runnerTime, interval)
        const runnerDistance = updateRunnerDistanceFn(team[runner].speed,updatedRunnerTime)
        const currentDistance = updateDistanceFn(runnerDistance, prevDistance);
        setTimeout(function () {
            // check if overall race has been completed
            if (hasFinishedCheck(completeDistance, currentDistance)) {
                printResultFn(team[runner].type, elapsedTime, team[runner].name);
                return;
            }
            // check if individual distance has been completed and swap else keep running
            if (currentDistance >= ((runner + 1) * distance)){
                raceLogic((runner + 1),currentDistance,0);
            }else{
                raceLogic(runner,currentDistance, runnerTime);
            }
            printProgressFn(team[runner].type, team[runner].name, team[runner].speed, currentDistance, elapsedTime)
        }, interval)
        
    }
    setTimeout(function () { raceLogic(0,0,0) },interval)
}
allTeams.forEach(
    function (raceTeam) {
        race(1000, 100, raceTeam, hasFinished, printResults, printProgress, updateDistance, updateRunnerDistance, updateRunnerTime)
    }
)