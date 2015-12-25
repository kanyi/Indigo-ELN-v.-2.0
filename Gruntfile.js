'use strict';

module.exports = function (grunt) {

    grunt.initConfig({
        app: {
            src: 'src/main/webapp',
            dist: 'target/dist'
        },

        clean: [
            '.tmp',
            '<%= app.dist %>'
        ],

        useminPrepare: {
            html: '<%= app.src %>/index.html',
            options: {
                dest: '<%= app.dist %>/'
            }
        },

        usemin: {
            html: '<%= app.dist %>/index.html'
        },

        copy: {
            fonts: {
                files: [{
                    expand: true,
                    dot: true,
                    flatten: true,
                    cwd: 'src/main/webapp',
                    dest: '<%= app.dist %>/fonts',
                    src: [
                        'bower_components/bootstrap/fonts/*.*'
                    ]
                }]
            },
            html: {
                cwd: '<%= app.src %>',
                src: [
                    '**/*',
                    '!**/*.js',
                    '!**/*.css',
                    '!bower_components/**'
                ],
                dest: '<%= app.dist %>',
                expand: true
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-usemin');

    grunt.registerTask('default', [
        'clean'
    ]);

    grunt.registerTask('release', [
        'clean',
        'copy',
        'useminPrepare',
        'concat',
        'cssmin',
        'uglify',
        'usemin'
    ]);
};