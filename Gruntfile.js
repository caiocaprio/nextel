module.exports = function(grunt) {

    // Project configuration.

    var defaults = {
        app: '.',
        src: 'src',
        preview: 'preview',
        dist: 'dist'
    };

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        defaults: defaults,

        connect: {
            preview: {
                options: {
                    port: 9000,
                    hostname: '*',
                    base: '<%= defaults.preview %>'
                }
            }
        },

        watch: {
            options: {
                livereload: true
            },

            html: {
                files: [
                    '<%= defaults.src %>/html/**/*.html'
                ],
                tasks: ['includereplace:preview']
            },

            compass: {
                files: '<%= defaults.src %>/scss/**/*.scss',
                tasks: ['compass:preview']
            },

            js: {
                files: ['<%= defaults.src %>/js/**/*.js'],
                tasks: ['newer:uglify:preview']
            },

            'third-party': {
                files: ['<%= defaults.src %>/third-party/**/*.{js,css,png,jpg,gif}'],
                tasks: ['copy:preview']
            },

            images: {
                options: {
                    spawn: false
                },
                files: ['<%= defaults.src %>/img/**/*.{png,jpg,gif}'],
                tasks: ['copy:preview']
            }
        },

        compass: {
            preview: {
                options: {
                    imagesDir: "<%= defaults.src %>/img/",
                    generatedImagesDir: "<%= defaults.preview %>/img/",
                    generatedImagesPath: "<%= defaults.preview %>/img/",
                    httpGeneratedImagesPath: "../img/",

                    sassDir: '<%= defaults.src %>/scss/',
                    cssDir: '<%= defaults.preview %>/css/'
                }
            },
            dist: {
                options: {
                    outputStyle: 'compressed',
                    imagesDir: "<%= defaults.src %>/img/",
                    generatedImagesDir: "<%= defaults.dist %>/img/",
                    generatedImagesPath: "<%= defaults.dist %>/img/",
                    httpGeneratedImagesPath: "../img/",

                    sassDir: '<%= defaults.src %>/scss/',
                    cssDir: '<%= defaults.dist %>/css/'
                }
            }
        },

        includereplace: {
            preview: {
                options: {
                    globals: {
                        baseURL: '',
                        livereloadScript: '<!--[if !IE]><!--><script src="//localhost:9000/livereload.js"></script><!--<![endif]-->'
                    }
                },
                files: [{
                    cwd: '<%= defaults.src %>/html/page/',
                    src: '{,*/}*.html',
                    dest: '<%= defaults.preview %>/',
                    expand: true,
                }]
            },
            dist: {
                options: {
                    globals: {
                        baseURL: '',
                        livereloadScript: ''
                    }
                },
                files: [{
                    cwd: '<%= defaults.src %>/html/page/',
                    src: '{,*/}*.html',
                    dest: '<%= defaults.dist %>/',
                    expand: true,
                }]
            }
        },

        copy: {
            preview: {
                files: [{
                    expand: true,
                    cwd: '<%= defaults.src %>',
                    src: [
                        'third-party/**',
                        'font/**',
                        'htc/**',
                        'img/**',
                        'media/**',
                        'js/**/*.ldsh*'
                    ],
                    dest: '<%= defaults.preview %>/'
                }]
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= defaults.src %>',
                    src: [
                        'third-party/**',
                        'font/**',
                        'img/**',
                        'htc/**',
                        'media/**',
                        'js/**/*.ldsh*'
                    ],
                    dest: '<%= defaults.dist %>/'
                }]
            }
        },

        uglify: {
            preview: {
                options: {
                    mangle: false,
                    compress: false,
                    beautify: true
                },
                files: [{
                    expand: true,
                    cwd: '<%= defaults.src %>/js',
                    src: '**/*.js',
                    dest: '<%= defaults.preview %>/js'
                }]
            },
            dist: {
                options: {
                    mangle: true,
                    compress: {
                        drop_console: true
                    },
                    beautify: false
                },
                files: [{
                    expand: true,
                    cwd: '<%= defaults.src %>/js',
                    src: '**/*.js',
                    dest: '<%= defaults.dist %>/js'
                }]
            }
        },

        clean: {
            preview: ['<%= defaults.preview %>'],
            dist: ['<%= defaults.dist %>']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');

    grunt.loadNpmTasks('grunt-include-replace');
    grunt.loadNpmTasks('grunt-newer');


    // Default task(s).
    grunt.registerTask('default', ['server']);

    grunt.registerTask('server', [
        'connect:preview',
        'build',
        'watch'
    ]);

    grunt.registerTask('build', [
        'clean:preview',
        'includereplace:preview',
        'compass:preview',
        'uglify:preview',
        'copy:preview',
    ]);

    grunt.registerTask('dist', [
        'clean:dist',
        'includereplace:dist',
        'uglify:dist',
        'compass:dist',
        'copy:dist'
    ]);
};
