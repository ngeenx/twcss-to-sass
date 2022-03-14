const isBrowserDarkTheme = window.matchMedia(
  '(prefers-color-scheme: dark)'
).matches

new Vue({
  el: '#app',
  vuetify: new Vuetify({
    theme: {
      dark: isBrowserDarkTheme,
    },
  }),

  components: {
    VueSplitter,
  },

  data: {
    htmlInput: null,
    sassOutput: null,
    htmlMonacoEditor: null,
    outputSassMonacoEditor: null,
    inputTabModel: null,
    outputTabModel: null,

    // snackbar model
    snackbar: {
      message: '',
      color: 'blue',
      timeout: 3000,
      show: false,
    },
    // snackbar: false,
    // messageSnackbarColor: 'blue',
    // messageSnackbarMessage: null,

    // twcss converter configs
    converterConfigs: {
      useCommentBlocksAsClassName: true,
      printComments: true,
      classNameOptions: {
        lowercase: true,
        replaceWith: '-',
        prefix: '',
        suffix: '',
      },
    },

    inputHtmlMonacoEditor: null,
  },

  methods: {
    /** twcss to sass convert */
    convert: function (firstLoad) {
      const defaultTemplate = `<!-- Container Start -->\n<!-- Container Any -->\n<div class="bg-white">\n\t<!-- Some Div -->\n\t<div class="flex justify-center items-center min-h-screen min-w-full">\n\t\t<div class="flex relative">\n\t\t\t<!-- Inner Div -->\n\t\t\t<div class="w-72 h-40 bg-green-400 transform transition-all skew-x-12 -skew-y-12 absolute rounded-lg">\n\t\t\t\tMy Text 1\n\t\t\t</div>\n\t\t</div>\n\t</div>\n</div>\n<!-- Container End-->`

      const userTemplate = store.get('userTemplate') || defaultTemplate

      if (firstLoad) {
        this.inputHtmlMonacoEditor
          .getModel()
          .setValue(
            userTemplate.template ? userTemplate.template : defaultTemplate
          )

        this.outputHtmlMonacoEditor
          .getModel()
          .setValue(userTemplate.output.html)
        this.outputSassMonacoEditor
          .getModel()
          .setValue(userTemplate.output.sass)
      }

      const { convertToSass } = TwCssToSass

      const template = this.inputHtmlMonacoEditor.getValue()

      if (template) {
        let converterResult = convertToSass(template, this.converterConfigs)

        if (converterResult) {
          this.outputHtmlMonacoEditor.getModel().setValue(converterResult.html)
          this.outputSassMonacoEditor.getModel().setValue(converterResult.sass)

          store.set('userTemplate', {
            template: template,
            output: converterResult,
          })

          return
        }

        this.snackbar.show = true
        this.snackbar.message = '3343 434 3'
      }
    },

    /** load monaco code editors */
    loadEditors: function () {
      const theme = this.getCurrentTheme(),
        commonEditorConfig = {
          theme: `vs-${theme}`,
          minimap: {
            enabled: false,
          },
        }

      //#region Input Editors

      this.inputHtmlMonacoEditor = monaco.editor.create(
        document.getElementById('inputHtmlEditorContainer'),
        Object.assign(commonEditorConfig, { language: 'html' })
      )

      this.inputHtmlMonacoEditor.onDidChangeModelContent(() => {
        // const template = this.inputHtmlMonacoEditor.getValue();

        // let converterResult = convertToSass(template, converterConfigs);

        // outputHtmlMonacoEditor.getModel().setValue(converterResult.html);
        // outputSassMonacoEditor.getModel().setValue(converterResult.sass);

        // store.set('userTemplate', {
        //   template: template,
        //   output: converterResult
        // });

        this.convert()

        console.log(45)
      })

      //#endregion

      //#region Output Editors

      this.outputHtmlMonacoEditor = monaco.editor.create(
        document.getElementById('outputHtmlEditorContainer'),
        Object.assign(commonEditorConfig, { language: 'html' })
      )

      // Output SASS Editor
      this.outputSassMonacoEditor = monaco.editor.create(
        document.getElementById('outputSassEditorContainer'),
        Object.assign(commonEditorConfig, { language: 'scss' })
      )

      //#endregion

      this.convert(true)
    },

    /** get current browser theme */
    getCurrentTheme: function () {
      if (window.matchMedia) {
        return window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light'
      }
    },

    /** watch browser theme*/
    watchBrowserTheme: function () {
      window
        .matchMedia('(prefers-color-scheme: dark)')
        .addEventListener('change', (e) => {
          const themeOption = {
            theme: `vs-${e.matches ? 'dark' : 'light'}`,
          }

          inputHtmlMonacoEditor.updateOptions(themeOption)

          this.outputHtmlMonacoEditor.updateOptions(themeOption)
          this.outputSassMonacoEditor.updateOptions(themeOption)

          this.$vuetify.theme.isDark = e.matches
        })
    },

    /** resize editors on splitter position change */
    onSplitterResize: function () {
      inputHtmlMonacoEditor.layout()

      this.outputHtmlMonacoEditor.layout()
      this.outputSassMonacoEditor.layout()
    },

    /** resize editors on input tabs switch */
    onInputTabSwitch: function (tab) {
      setTimeout(() => {
        if (tab == 'inputHtmlTab') {
          inputHtmlMonacoEditor.layout()
        }
      }, 250)
    },

    /** resize editors on output tabs switch */
    onOutputTabSwitch: function (tab) {
      setTimeout(() => {
        if (tab == 'outputHtmlTab') {
          this.outputHtmlMonacoEditor.layout()
        } else if (tab == 'outputSassTab') {
          this.outputSassMonacoEditor.layout()
        }
      }, 250)
    },
  },

  mounted: function () {
    document.querySelector('.loader').remove()

    setTimeout(() => {
      this.loadEditors()

      this.watchBrowserTheme()
    }, 250)
  },
})
