module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            ex3a3: {
                files: [{
                    src: 'ex3/a3/src/server.js',
                    dest: 'ex3/a3/built/server.js'
                }]
            }
        },
        copy: {
            ex3a3: {
                expand: true,
                cwd: 'ex3/a3/src/public',
                src: ['**'],
                dest: 'ex3/a3/built/public'
            }
        }
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');

    // Default task(s).
    grunt.registerTask('default', ['uglify:ex3a3', 'copy:ex3a3']);

};