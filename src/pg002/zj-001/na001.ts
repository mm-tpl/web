import an6 from '@mmstudio/an000006';
import an5 from '@mmstudio/an000005';
import an7 from '@mmstudio/an000007';
import an2 from '@mmstudio/an000002';

import p01 from './p01';
import p02 from './p02';

export default async function na001(mm: an2) {
	// 获取地址栏参数值
	const r1583730004 = (() => {
		const key = 'sort';	// url参数名
		const default_value = 'asc';	// 默认值,如果不希望使用默认值，可以删除该参数或者传入空值
		return an7(mm, key, default_value);
	})();
	// 调用nodejs服务
	const r1583730016 = await (() => {
		const service_name = 'pg002/zj-001/s001';	// 服务名称
		const msg = { sort: r1583730004 };	// 参数
		return an5<string[]>(service_name, msg, mm.data.actionid);
	})();
	// html渲染
	(() => {
		const data = r1583730016;	// 要渲染的数据
		return an6(mm, data, p01, 'p01');
	})();
	// html渲染
	(() => {
		const data = r1583730004 === 'asc' ? 'desc' : 'asc';	// 要渲染的数据,sort参数
		return an6(mm, data, p02, 'p02');
	})();
}
