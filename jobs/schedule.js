// import Agenda from 'agenda';
const { Agenda } = require('agenda')

const mongoConnectionString = 'mongodb://localhost:27017/';

const agenda = new Agenda({ db: { address: mongoConnectionString } });

module.exports = {
    backupDatabase() {

        agenda.define('welcomeMessage', { priority: 'normal' }, () => {
            console.log('Sending a welcome message every few seconds');
        });

        agenda.define('dataExport', { priority: 'high' }, (job) => {
            const { name, path } = job.attrs.data;
            console.log(`Exporting ${name} data to ${path}`);
        });

        setTimeout(async () => {
            await agenda.start();
            await agenda.cancel({ name: 'welcomeMessage' });
            // await agenda.disable({ name: '<job_name>' });
            // await agenda.enable({ name: '<job_name>' });

            await agenda.every('1 seconds', 'welcomeMessage');

            // // 0 0 */3 * *
            // await agenda.every('5 seconds', 'dataExport', {
            //     name: 'Sales report',
            //     path: '/home/username/sales_report.csv',
            // });

            // await agenda.schedule('tomorrow at noon', 'dataExport', {
            //     jobData: 'data the job needs',
            // });

            // await agenda.now('dataExport', {
            //     jobData: 'data the job needs',
            // });
        }, 0);

    }
};



