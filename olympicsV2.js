// =========================================================================
// Race objects and classes so you can create multiple races, runners, teams, characters etc
function Race(teams = [], distance) {
    this.teams = teams;
    this.distance = distance;
}
// set up html file
Race.prototype.getSet = function () {
    console.log(document.getElementById("race-container"))
    this.teams.forEach(function(team){
        var newTeamLogo = document.createElement('img');
        var divRow = document.createElement('div');
        divRow.className = "row"
        divRow.appendChild(newTeamLogo);
        newTeamLogo.id = team.name;
        newTeamLogo.src = team.image;
        document.getElementById("race-container").appendChild(divRow);
    })
};
// Allows you to change the rules and conditions of the race
Race.prototype.go = function (raceLogic, distance) {
    raceLogic.call(this, distance);
};
function Team(teamName, teamMembers = [], teamImgSrc) {
    this.name = teamName;
    this.members = teamMembers;
    this.distanceCovered = 0;
    this.currentRunnerIndex = 0;
    this.timeSeconds = 0;
    this.finishTimeSeconds = 0;
    this.image = teamImgSrc;
}
Team.prototype.start = function (distance,interval) {    
        if (this.distanceCovered >= (this.members.length * distance)) {
            return this.finish();  
        } else {
            if (this.distanceCovered >= (this.currentRunnerIndex + 1) * distance) { this.currentRunnerIndex += 1; }
           
            this.distanceCovered += (this.members[this.currentRunnerIndex].speed * (interval/1000))
            this.members[this.currentRunnerIndex].run((interval/1000));
           
            // console log progress
            console.log(this.name + ' - current runner is:' + this.members[this.currentRunnerIndex].name + '\n running at a speed of ' + this.members[this.currentRunnerIndex].speed + 'm/s \n Total Distance Covered: ' + this.distanceCovered + '\n with an individual distance of: ' + this.members[this.currentRunnerIndex].distanceRan)
            updateRunnerIcon.call(this, distance)
        }
    this.timeSeconds += (interval/1000)
}
Team.prototype.finish = function () {
    if(this.finishTimeSeconds === 0){
        this.finishTimeSeconds = this.timeSeconds
        console.log(`Team ${this.name.toUpperCase()} finished! \n ${this.members[this.currentRunnerIndex].name} crossed the finish line in ${this.finishTimeSeconds} seconds!`)
        updateCommentaryBox.apply(this)
    } 
}
function Runner(type, speed, name) {
    this.type = type;
    this.name = name;
    this.speed = speed;
    this.distanceRan = 0;
    this.runnerTimeSeconds = 0;
}
Runner.prototype.run = function(interval){    
    this.runnerTimeSeconds += interval
    this.distanceRan =  this.speed * this.runnerTimeSeconds
}
// ===========================================================================
// functions 
// add additional team functions
// define team types and array of functions to create differentt runner types
var runnerTypesFn = [
    { type: 'rabbit', typeFn: createRabbitRunner, imgSrc: 'https://image.shutterstock.com/image-vector/cute-white-rabbit-cartoon-style-260nw-1923908276.jpg' },
    { type: 'turtle', typeFn: createTurtleRunner, imgSrc: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYcadVQHluZ68uTo37xgmt3Y9DnSiWUt_4wg&usqp=CAU' },
    { type: 'dog', typeFn: createDogRunner, imgSrc: 'https://i.pinimg.com/originals/32/a4/41/32a4412f3aa942ef8c2d6d143e3879d3.jpg' }]

function createTurtleRunner(teamNumber) {
    var speed = 1 + steroids();
    speed = Math.round(speed);
    return new Runner('turtle', speed, 'T-' + teamNumber)
}
function createRabbitRunner(teamNumber) {
    return new Runner('rabbit', 10, 'R-' + teamNumber)
}
function createDogRunner(teamNumber) {
    return new Runner('dog', 50, 'D-' + teamNumber)
}
function updateRunnerIcon(distance){
    var pctCovered = (this.distanceCovered / (this.members.length * distance)) * 100;
    document.getElementById(this.name).style = "left:" + pctCovered + '%';
}
function updateCommentaryBox(){
    var paragraph = document.createElement('p')
    paragraph.innerHTML = `Team ${this.name.toUpperCase()} finished! \n ${this.members[this.currentRunnerIndex].name} crossed the finish line in ${this.finishTimeSeconds} seconds!`
    document.getElementById('commentary-box').appendChild(paragraph)
}
// speed booster
function steroids() {
    return 20 * Math.random()
}
// create runners and assign them a team
function createTypeRunners(noRunners, runnerType, fnCreateTypeRunner, imgSrc) {
    var runners = []
    for (var i = 0; i < noRunners; i++) {
        runners.push(fnCreateTypeRunner(i));
    }
    return new Team(runnerType, runners, imgSrc)
}
// Create teams and runners. Then create the race with the teams in the array.
function onYourMarks(noRunners, distance) {
    var teams = [];
    runnerTypesFn.forEach(
        function (runner) {
            teams.push(createTypeRunners(noRunners, runner.type, runner.typeFn, runner.imgSrc));
        })
    return new Race(teams, distance)
}
// Potential add raceLogic here so race rules can be altered
function raceLogic(interval) {
    var teams = this.teams,
        distance = this.distance,
        raceFinished = []; // record of team that has finished     
// update progress every second
    var beginRace = setInterval(function(){
        if (raceFinished.length == teams.length) {
            // console.log('TEAM LENGTH: ', teams.length);
            // console.log('RACEFINISH LENGTH: ', raceFinished.length);
             clearInterval(beginRace) }
      teams.forEach(function(team){
        team.start(distance,interval);
        team.finishTimeSeconds !== 0 && raceFinished.indexOf(team.name) < 0 ? raceFinished.push(team.name) : null; // record team that has finished
      })
    },interval)
}
// areas for improvement/ assumptions - turtle speed boost was predefined before their run. 
// setIntervals quicker for less margin of error and make the start more equal between rabbit and turtle.
// combine create runner functions
// start function should be in the race logic so this can be changed at will

// To initiate race:
// set up Race
var newRace = onYourMarks(2, 100)
document.addEventListener('DOMContentLoaded', function(){
    newRace.getSet();
}, false);
document.addEventListener('click', function () {
    newRace.go(raceLogic,1000)},false);