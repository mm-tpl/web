import aw3 from '@mmstudio/aw000003';
import aw5 from '@mmstudio/aw000005';
import aw4 from '@mmstudio/aw000004';
import aw1 from '@mmstudio/aw000001';

import p01 from './p01';
import p02 from './p02';

export default async function a001(mm: aw1) {
	// get url param
	/**
	 * url 中 sort 值
	 */
	const r1583724505 = (() => {
		const key = 'sort';	// url参数名
		const default_value = 'asc';	// 默认值,如果不希望使用默认值，可以删除该参数或者传入空值
		return aw3(mm, key, default_value);
	})();
	// 调用nodejs服务
	const r1583660193 = await (() => {
		const service_name = 'pg001/zj-001/s001';	// 服务名称
		const msg = { sort: r1583724505 };	// 参数
		return aw4<string[]>(service_name, msg);
	})();
	// html渲染
	(() => {
		const data = r1583660193;	// 要渲染的数据
		const position = 'inner';	// inner 替换全部子结点 after 当前结点之后 before 当前结点之前 firstin 第一个子结点之前 lastin 最后一个子结点之后
		return aw5(mm, data, p01, 'p01', position);
	})();
	// html渲染
	(() => {
		const data = r1583724505 === 'asc' ? 'desc' : 'asc';	// 要渲染的数据,sort参数
		const position = 'inner';	// inner 替换全部子结点 after 当前结点之后 before 当前结点之前 firstin 第一个子结点之前 lastin 最后一个子结点之后
		return aw5(mm, data, p02, 'p02', position);
	})();
}
