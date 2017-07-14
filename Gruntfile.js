module.exports = function (grunt) {
    grunt.initConfig({
        clean: {
            build: [
                "package"
            ]
        },
        copy: {
            build: {
                files: [
                    {
                        src: "LICENSE.md",
                        dest: "package/LICENSE.md"
                    },
                    {
                        src: "CHANGELOG.md",
                        dest: "package/CHANGELOG.md"
                    },
                    {
                        src: "README.md",
                        dest: "package/README.md"
                    },
                    {
                        src: "src/package.json",
                        dest: "package/package.json"
                    }
                ]
            }
        },
        babel: {
            build: {
                files: [{
                    expand: true,
                    cwd: "src/",
                    src: [
                        "**/*.js", "!**/node_modules/**", "!**/istanbul/**"
                    ],
                    dest: "package/",
                    ext: ".js"
                }]
            }
        }
    })

    grunt.loadNpmTasks('grunt-babel')

    grunt.loadNpmTasks('grunt-contrib-copy')
    grunt.loadNpmTasks('grunt-contrib-clean')

    grunt.registerTask('default', [])

    grunt.registerTask('build', ['clean:build', 'copy:build', 'babel:build'])
}