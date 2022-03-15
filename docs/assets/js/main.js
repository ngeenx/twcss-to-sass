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
    inputHtmlMonacoEditor: null,
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
          })

          return
        }

        this.snackbar.show = true
        this.snackbar.message = 'Conversion failed'
        this.snackbar.color = 'red'
      }

      this.snackbar.show = true
      this.snackbar.message = 'Tailwind template not found'
      this.snackbar.color = 'red'

      setTimeout(() => {
        this.snackbar = {}
      }, 2000)
    },

    /**
     * fix tailwind fix @ rules
     *
     * @source https://github.com/microsoft/monaco-editor/issues/2284#issuecomment-858872212
     * @source https://stackoverflow.com/a/61333686/6940144
     */
    installTailwindSassConfigs: function () {
      const dataProvider = {
        version: 1.1,
        atDirectives: [
          {
            name: '@apply',
            description:
              'When using Tailwind with Sass, using !important with @apply requires you to use interpolation to compile properly.',
            references: [
              {
                name: 'Tailwind Documentation',
                url: 'https://tailwindcss.com/docs/using-with-preprocessors#sass',
              },
            ],
          },
          {
            name: '@tailwind',
            description:
              "Use the `@tailwind` directive to insert Tailwind's `base`, `components`, `utilities` and `screens` styles into your CSS.",
            references: [
              {
                name: 'Tailwind Documentation',
                url: 'https://tailwindcss.com/docs/functions-and-directives#tailwind',
              },
            ],
          },
          {
            name: '@responsive',
            description:
              'You can generate responsive variants of your own classes by wrapping their definitions in the `@responsive` directive:\n```css\n@responsive {\n  .alert {\n    background-color: #E53E3E;\n  }\n}\n```\n',
            references: [
              {
                name: 'Tailwind Documentation',
                url: 'https://tailwindcss.com/docs/functions-and-directives#responsive',
              },
            ],
          },
          {
            name: '@screen',
            description:
              'The `@screen` directive allows you to create media queries that reference your breakpoints by **name** instead of duplicating their values in your own CSS:\n```css\n@screen sm {\n  /* ... */\n}\n```\n…gets transformed into this:\n```css\n@media (min-width: 640px) {\n  /* ... */\n}\n```\n',
            references: [
              {
                name: 'Tailwind Documentation',
                url: 'https://tailwindcss.com/docs/functions-and-directives#screen',
              },
            ],
          },
          {
            name: '@variants',
            description:
              'Generate `hover`, `focus`, `active` and other **variants** of your own utilities by wrapping their definitions in the `@variants` directive:\n```css\n@variants hover, focus {\n   .btn-brand {\n    background-color: #3182CE;\n  }\n}\n```\n',
            references: [
              {
                name: 'Tailwind Documentation',
                url: 'https://tailwindcss.com/docs/functions-and-directives#variants',
              },
            ],
          },
        ],
      }

      monaco.languages.css.scssDefaults.setOptions({
        data: {
          useDefaultDataProvider: true,
          dataProviders: [dataProvider],
        },
      })
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
        this.convert()
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

          this.inputHtmlMonacoEditor.updateOptions(themeOption)

          this.outputHtmlMonacoEditor.updateOptions(themeOption)
          this.outputSassMonacoEditor.updateOptions(themeOption)

          this.$vuetify.theme.isDark = e.matches
        })
    },

    /** resize editors on splitter position change */
    onSplitterResize: function () {
      this.inputHtmlMonacoEditor.layout()

      this.outputHtmlMonacoEditor.layout()
      this.outputSassMonacoEditor.layout()
    },

    /** resize editors on input tabs switch */
    onInputTabSwitch: function (tab) {
      setTimeout(() => {
        if (tab == 'inputHtmlTab') {
          this.inputHtmlMonacoEditor.layout()
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

    /** format html contents (input and output) */
    formatHtml: function () {
      // trigger formatter method
      this.inputHtmlMonacoEditor.getAction('editor.action.formatDocument').run()

      // scroll to top
      this.inputHtmlMonacoEditor.setPosition({ column: 1, lineNumber: 1 })
      this.outputHtmlMonacoEditor.setPosition({ column: 1, lineNumber: 1 })
    },
  },

  mounted: function () {
    document.querySelector('.loader').remove()

    setTimeout(() => {
      this.loadEditors()
      this.installTailwindSassConfigs()

      this.watchBrowserTheme()
    }, 250)
  },
})
