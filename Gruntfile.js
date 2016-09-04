module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        connect: {
            dev: {
                options: {
                    port: 3000,
                    hostname: 'localhost',
                    livereload: true,
                    open: true
                }
            }
        },

        sass: {
            dist: {
                options: {
                    style: 'compressed',
                    noCache: true
                },
                files: {
                    'css/styles.css': 'scss/styles.scss'
                }
            }
        },

        wiredep: {
            task: {
                src: ['index.html']
            }
        },

        watch: {
            html: {
                files: ['index.html'],
                options: {
                    livereload: true
                }
            },
            css: {
                files: ['scss/styles.scss'],
                tasks: ['sass'],
                options: {
                    livereload: true
                }
            },
            js: {
                files: ['Gruntfile.js', 'js/app.js'],
                options: {
                    livereload: true
                }
            }
        }

    });

    // loads
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-wiredep');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // tasks
    grunt.registerTask('default', ['sass', 'wiredep', 'connect', 'watch']);
};
