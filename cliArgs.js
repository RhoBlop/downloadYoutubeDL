const yargs = require('yargs');

module.exports = yargs(process.argv.slice(2))
	.option('from-file', {
		alias: 'f',
		description: 'Get options from json file (multiple downloads)',
		type: 'string'
	})
	.option('audio-only', {
		alias: 'a',
		description: 'Download only audio',
		type: 'boolean'
	})
	.option('audio-format', {
		description:
			'Specify audio format: "best", "aac", "flac", "mp3", "m4a", "opus", "vorbis", or "wav"; "best" by default; No effect without -a',
		type: 'string'
	})
	.option('skip', {
		alias: 's',
		description:
			'Skip X miliseconds from video. Use integrated with --duration',
		type: 'number'
	})
	.option('duration', {
		alias: 'd',
		description: 'Duration of video to be downloaded in miliseconds',
		type: 'number'
	})
	.option('destination', {
		alias: 'o',
		description: 'Path to save download',
		type: 'string'
	})
	.help()
	.alias('help', 'h').argv;
