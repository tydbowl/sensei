module.exports = function (grunt) {

  grunt.initConfig ({
    pkg : grunt.file.readJSON('package.json'),

    clean: {
      css: ['css'],
      temp: ['temp.css']
    },

    less:{
      app:{
        options: {
          paths: ['less']
        },
        files : {
          'css/raleway.css': 'less/raleway.less'
        }
      }
    },

    sass: {
      dist: {
        files: {
          'temp.css': 'scss/raleway.scss'
        }
      }
    },

    cssmin :{
      app : {
        files : {
          'css/raleway.min.css': 'css/raleway.css'
        }
      }
    }
  });

  // Load NPM Tasks
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-sass');

  // Default Task Validates Less and Builds CSS for dist
  grunt.registerTask("default", ['clean', 'less', 'sass', 'cssmin', 'clean:temp']);
};
