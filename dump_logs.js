const { execSync } = require('child_process');
const fs = require('fs');

try {
    const std = execSync('docker logs user-service 2>&1').toString();
    fs.writeFileSync('d:\\beastate\\user-service.log', std);
} catch (err) {
    fs.writeFileSync('d:\\beastate\\user-service.log', err.stdout ? err.stdout.toString() : err.message);
}
