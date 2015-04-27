module.exports = function(grunt) {

    var PORT = 8080;

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
        },
        shell: {
            testServer: {
                options: {
                    stdout: true
                },
                command: ' jasmine-node ex3/a3'
            }
        },
        express: {
            options: {

            },
            server: {
                options: {
                    script: 'ex3/a3/src/server.js',
                    args: [PORT]
                }
            }
        }
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-express-server');

    // Default task(s).
    grunt.registerTask('default', ['express:server', 'shell:testServer', 'uglify:ex3a3', 'copy:ex3a3']);

};