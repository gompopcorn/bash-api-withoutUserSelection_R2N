const shell = require('shelljs');

const bashFilesDir = path.join(__dirname, '../bash-files');


let shellResult = shell.exec(`${bashFilesDir}/createCar.sh bash_car_${i} ${args[1]} ${args[2]} ${args[3]} ${args[4]}`);

if (shellResult.code !== 0) {
    let shellError = shellResult.stderr;
    console.log(colors.bgRed("Error in createCar.sh"));
    console.log(colors.red(shellError));
    return;
} else message = `Successfully added the car asset with key ${args[0]}`;