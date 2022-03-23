import { ITwToSassOptions } from '../src/interfaces/tw-to-sass-options'
import { convertToSass } from '../src/twcss-to-sass'

test('convert to sass for html', () => {
  const htmlCotnent = `<!-- Container Start -->
<!-- Container Any -->
<div class="bg-white">
    <!-- Some Div -->
    <div class="flex justify-center items-center min-h-screen min-w-full">
        ...
    </div>
</div>
<!-- Container End-->`

  const htmlOutput = `<!-- Container Any -->
<div class="container-any">
    <!-- Some Div -->
    <div class="some-div">
        ...
    </div>
</div>`

  const converterConfigs = <ITwToSassOptions>{
    useCommentBlocksAsClassName: true,
    printSassComments: true,
  }

  const converterResult = convertToSass(htmlCotnent, converterConfigs)

  expect(converterResult?.html).toBe(htmlOutput)
})

test('convert to sass for html with void elements', () => {
  const htmlCotnent = `<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>Document</title>

    <link rel="stylesheet" href="https://cdn.materialdesignicons.com/6.5.95/css/materialdesignicons.min.css" />

    <base href="/public">
</head>

<body>
    <h1 class="ml-1">Test Title</h1>
    <br>
    <br>
    <br>

    <hr />

    <input value="Say My Name">
</body>

</html>`

  const htmlOutput = `<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <title>
        Document
    </title>

    <link rel="stylesheet" href="https://cdn.materialdesignicons.com/6.5.95/css/materialdesignicons.min.css" />

    <base href="/public" />
</head>

<body>
    <h1>
        Test Title
    </h1>

    <br />
    <br />
    <br />

    <hr />

    <input value="Say My Name" />
</body>

</html>`

  const converterConfigs = <ITwToSassOptions>{
    useCommentBlocksAsClassName: true,
    printSassComments: true,
  }

  const converterResult = convertToSass(htmlCotnent, converterConfigs)

  expect(converterResult?.html).toBe(htmlOutput)
})
