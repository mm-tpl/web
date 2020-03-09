import an1 from '@mmstudio/an000001';
import an4 from '@mmstudio/an000004';

interface Message {
	sort: 'asc' | 'desc';
}

export default async function atom(msg: Message, action_id: string): Promise<an4> {
	an1(`Service begin path:pg001/zj-001/s001,action_id:${action_id}`);
	// 记录日志
	const data = ['mmstudio1', 'mmstudio2'].sort((a, b) => {
		if (a === b) {
			return 0;
		}
		if (msg.sort === 'desc') {
			return a < b ? 1 : -1;
		}
		return a > b ? 1 : -1;
	});
	an1(`Service end path:pg001/zj-001/s001,action_id:${action_id}`);
	return {
		data
	} as an4;
}
