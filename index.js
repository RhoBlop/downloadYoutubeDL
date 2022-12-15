const ytdl = require('youtube-dl-exec');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs').promises;
const path = require('path');
const argv = require('./cliArgs');

(async () => {
	if (argv.fromFile) {
		try {
			const file = JSON.parse(await fs.readFile(argv.fromFile));

			for (downl of file) {
				// download with youtube-dl
				let { destination, skip, duration } = downl;
				const options = {
					quiet: true,
					addHeader: [
						'referer:youtube.com',
						'user-agent:Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:108.0) Gecko/20100101 Firefox/108.0'
					]
				};

				if (argv.audioOnly) {
					options.extractAudio = Boolean(argv.audioOnly);
					options.audioQuality = 9;
				}
				if (argv.audioFormat) {
					options.audioFormat = argv.audioFormat;
				}
				if (destination) {
					options.output = destination;
				}
				const data = await ytdl(downl.url, options);

				if (skip) {
					// cut audio with ffmpeg
					const fullVideo = path.parse(destination);
					const videoPath = path.join(
						fullVideo.dir,
						fullVideo.name + '.wav'
					);
					const targetPath = path.join(
						fullVideo.dir,
						fullVideo.name + '_cutted' + '.wav'
					);
					console.log(videoPath);
					const audio = ffmpeg(videoPath)
						.seekInput(msToTime(skip))
						.setDuration(msToTime(duration))
						.output(targetPath)
						.on('end', function (err) {
							if (!err) {
								console.log(`${targetPath} converted`);
							}
						})
						.on('error', (err) => console.log('error: ', err))
						.run();
				}
			}
		} catch (err) {
			console.log(err);
		}
	}
})();

function msToTime(s) {
	// Pad to 2 or 3 digits, default is 2
	function pad(n, z) {
		z = z || 2;
		return ('00' + n).slice(-z);
	}

	var ms = s % 1000;
	s = (s - ms) / 1000;
	var secs = s % 60;
	s = (s - secs) / 60;
	var mins = s % 60;
	var hrs = (s - mins) / 60;

	return pad(hrs) + ':' + pad(mins) + ':' + pad(secs) + '.' + pad(ms, 3);
}
