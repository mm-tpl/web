import { nc } from '@mmstudio/web';
import { HTMLElement } from 'node-html-parser';
import s from './ns';

import tpl from './tpl';

/// MM IMPACTIONS BEGIN
/// 请不要修改下面的代码哟(๑•ω•๑)
import na001 from './na001';

/// MM IMPACTIONS END

export default function main(html: HTMLElement, url: string, msg: unknown, headers: object, query: {}) {

	/// MM ACTIONS BEGIN
	/// 请不要修改下面的代码哟(๑•ω•๑)
	const actions = { na001 };

	/// MM ACTIONS END


	return nc('zj-001', tpl, s, actions, html, url, msg, headers, query);
}

