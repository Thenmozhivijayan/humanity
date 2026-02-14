import { exec } from 'child_process';

exec('npx prisma migrate dev --name complete_schema', (error, stdout, stderr) => {
  console.log(stdout);
  if (stderr) console.error(stderr);
});
