import { HTMLElement, parse } from 'node-html-parser';

const html = `<div>
	<h1>服务器端渲染示例</h1>
	<zj-001></zj-001>
</div>`;

export default parse(html) as HTMLElement;

