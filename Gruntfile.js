'use strict';
module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-browser-sync');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jshint');

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
                files: {
                    'dist/views.min.js': 'src/views.js'
                }
            }  
        },
        copy: {
            demo: {
                expand: true,
                src: 'dist/*',
                dest: 'demo/'
            },
            main: {
                expand: true,
                cwd: 'src/',
                src: ['views.js'],
                dest: 'dist/'
            }
        }
    });

    grunt.registerTask('default', ['browserSync']);
    grunt.registerTask('build', ['jshint', 'uglify', 'copy']);
};