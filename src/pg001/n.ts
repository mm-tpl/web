import { np } from '@mmstudio/web';
import html from './html';
import s from './ns';

/// MM IMPCOMPONENTS BEGIN
/// 请不要修改下面的代码哟(๑•ω•๑)
import c0 from './zj-001/n';

/// MM IMPCOMPONENTS END


/// MM IMPACTIONS BEGIN
/// 请不要修改下面的代码哟(๑•ω•๑)

/// MM IMPACTIONS END

export default async function main(url: string, msg: unknown, headers: object) {

	/// MM ACTIONS BEGIN
	/// 请不要修改下面的代码哟(๑•ω•๑)

	const actions = {};

	/// MM ACTIONS END


	const res = await np(html, url, msg, headers, s, actions
		/// MM COMPONENTS BEGIN
		/// 请不要修改下面的代码哟(๑•ω•๑)
		, c0

		/// MM COMPONENTS END
	);

	return `<!DOCTYPE html>
<html>

	<head>
		<meta charset="UTF-8">
		<meta http-equiv="X-UA-Compatible" content="ie=edge">
		<meta name="viewport" content="width=device-width,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no" />
		<meta name="apple-mobile-web-app-capable" content="yes" />
		<meta name="renderer" content="webkit">
		<title>render-demo</title>
		<link inline rel="stylesheet" type="text/css" href="./css/iconfont.css">
		<link rel="shortcut icon" href="favicon.ico" type="image/x-icon" />
		<link inline rel="stylesheet" type="text/css" href="./css/mm.css">
		<script src="//cdn.jsdelivr.net/npm/@webcomponents/webcomponentsjs"></script>
		<script src="//cdn.jsdelivr.net/npm/cross-fetch"></script>
		<script src="./dist/js/mmjs"></script>
		<script type="text/javascript">
			window.addEventListener('WebComponentsReady', function () {
				var t = document.createElement('script');
				t.src = './dist/js/pg001.js';
				document.head.appendChild(t);
			});
		</script>
	</head>
	<body>
	${res.toString()}
	</body>
</html>
	`;
}
