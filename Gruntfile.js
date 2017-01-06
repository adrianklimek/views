'use strict';
module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-browser-sync');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-prompt');

    grunt.initConfig({
        browserSync: {
            bsFiles: {
                src: [
                    'demo/dist/*.js',
                    'demo/css/*.css',
                    'demo/js/*.js',
                    'demo/*.html'
                ]
            },
            options: {
                server: {
                    baseDir: './demo'
                },
                open: false
            }
        },
        jshint: {
            files: ['src/views.js']
        },
        uglify: {
            main: {
                options: {
                    preserveComments: /(?:^!|@(?:license|preserve|cc_on))/
                },
                files: {
                    'dist/views.min.js': 'src/views.js'
                }
            }  
        },
        copy: {
            main: {
                expand: true,
                cwd: 'src/',
                src: '*.js',
                dest: 'dist'
            },
            demo: {
                expand: true,
                src: 'dist/*',
                dest: 'demo/'
            }
        }
    });

    grunt.registerTask('default', ['browserSync']);
    grunt.registerTask('build', ['jshint', 'uglify', 'copy']);
};