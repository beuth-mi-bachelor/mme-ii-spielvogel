module.exports = function(grunt) {

    var PORT = 1337;

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            ex3: {
                files: [{
                    src: 'ex3/a3/src/server.js',
                    dest: 'ex3/a3/built/server.js'
                }]
            },
            ex4: {
                files: [{
                        src: 'ex4/src/server.js',
                        dest: 'ex4/built/server.js'
                    },
                    {
                        src: 'ex4/src/models/book.js',
                        dest: 'ex4/built/models/book.js'
                    }]
            }
        },
        copy: {
            ex3: {
                expand: true,
                cwd: 'ex3/a3/src/public',
                src: ['**'],
                dest: 'ex3/a3/built/public'
            },
            ex4: {
                expand: true,
                cwd: 'ex4/src/public',
                src: ['**'],
                dest: 'ex4/built/public'
            }
        },
        express: {
            options: {

            },
            ex3: {
                options: {
                    script: 'ex3/a3/src/server.js',
                    args: [PORT]
                }
            },
            ex4: {
                options: {
                    script: 'ex4/src/server.js',
                    args: [PORT]
                }
            }
        },
        jasmine_node: {
            options: {
                forceExit: true,
                match: '.',
                matchall: true,
                extensions: 'js',
                specNameMatcher: 'specular'
            },
            all: []
        }
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-express-server');
    grunt.loadNpmTasks('grunt-jasmine-node');

    // Default task(s).
    //grunt.registerTask('default', ['express:ex3', 'jasmine_node:ex3', 'uglify:ex3', 'copy:ex3']);
    grunt.registerTask('default', ['express:ex4', "jasmine_node", 'uglify:ex4', 'copy:ex4']);

};