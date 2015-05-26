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
            },
            ex4a1: {
                files: [{
                    src: 'ex4/a1/src/server.js',
                    dest: 'ex4/a1/built/server.js'
                }]
            }
        },
        copy: {
            ex3a3: {
                expand: true,
                cwd: 'ex3/a3/src/public',
                src: ['**'],
                dest: 'ex3/a3/built/public'
            },
            ex4a1: {
                expand: true,
                cwd: 'ex4/a1/src/public',
                src: ['**'],
                dest: 'ex4/a1/built/public'
            }
        },
        shell: {
            testServer: {
                options: {
                    stdout: true
                },
                command: ' jasmine-node ex3/a3'
            },
            testServerEx4: {
                options: {
                    stdout: true
                },
                command: ' jasmine-node ex4/a1'
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
            },
            serverEx4: {
                options: {
                    script: 'ex4/a1/src/server.js',
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
    //grunt.registerTask('default', ['express:server', 'shell:testServer', 'uglify:ex3a3', 'copy:ex3a3']);
    grunt.registerTask('default', ['uglify:ex4a1', 'copy:ex4a1']);

};