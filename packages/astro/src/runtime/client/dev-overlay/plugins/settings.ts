import type { DevOverlayPlugin } from '../../../../@types/astro.js';
import { settings, type Settings } from '../settings.js';
import { createWindowWithTransition, waitForTransition } from './utils/window.js';

const icon =
	'<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 22 22"><path fill="#fff" d="M11 6.12507c-.9642 0-1.90671.28592-2.7084.82159-.80169.53567-1.42653 1.29704-1.79551 2.18783-.36898.89081-.46552 1.87101-.27742 2.81661.18811.9457.6524 1.8143 1.33419 2.4961.68178.6818 1.55042 1.1461 2.49604 1.3342.9457.1881 1.9259.0916 2.8167-.2774s1.6521-.9938 2.1878-1.7955c.5357-.8017.8216-1.7442.8216-2.7084-.0015-1.2925-.5156-2.53161-1.4295-3.44553-.9139-.91392-2.153-1.42801-3.4455-1.4295Zm0 7.50003c-.5192 0-1.02669-.154-1.45837-.4424-.43168-.2885-.76813-.6984-.96681-1.1781-.19868-.4796-.25067-1.0074-.14938-1.5166.10129-.50924.35129-.97697.71841-1.34408.36711-.36712.83484-.61712 1.34405-.71841.5092-.10129 1.037-.0493 1.5166.14938.4797.19868.8897.53513 1.1781.96681.2884.43168.4424.9392.4424 1.4584 0 .6962-.2766 1.3638-.7688 1.8561-.4923.4923-1.16.7689-1.8562.7689Zm8.625-2.551v-.1481l1.3125-1.64155c.1102-.13755.1865-.29905.2228-.4715s.0316-.35102-.0137-.52131c-.2369-.89334-.5909-1.75142-1.0528-2.55188-.089-.15264-.2127-.28218-.3611-.37811-.1484-.09594-.3173-.15557-.493-.17408l-2.0888-.23437-.104-.10406-.2344-2.08969c-.0186-.17556-.0783-.34426-.1743-.49247-.0959-.1482-.2254-.27175-.3779-.36066-.8005-.46341-1.6589-.81869-2.5528-1.056559-.1704-.044683-.349-.048704-.5213-.01174-.1723.036965-.3335.113881-.4706.224549l-1.6415 1.3125h-.1482l-1.64152-1.3125C9.14683.9524 8.98532.87608 8.81288.839767c-.17245-.036314-.35102-.031606-.52132.013744-.89357.238319-1.75165.593909-2.55187 1.057499-.15205.08854-.28121.2115-.37712.35901-.0959.14752-.15586.31547-.17507.49037l-.23437 2.08875-.10407.10406-2.08968.23437c-.17556.01865-.34426.07835-.49247.17428-.14821.09593-.27176.22539-.36066.37791-.46211.80072-.81613 1.65912-1.052812 2.55281-.045195.17016-.049823.34855-.013512.52082.03631.17227.112546.33362.222574.47106L2.375 10.926v.1481l-1.3125 1.6416c-.110173.1375-.186492.299-.222806.4715-.036313.1724-.031605.351.013744.5213.238622.8936.594522 1.7517 1.058442 2.5519.08844.1519.21126.281.3586.3769.14734.0959.3151.1559.48983.1753l2.08875.2325.10407.104.23437 2.0916c.01865.1756.07835.3443.17428.4925.09592.1482.22538.2717.37791.3606.80052.4634 1.65893.8187 2.55281 1.0566.17045.0447.349.0487.52129.0117.17228-.0369.33347-.1139.47059-.2245l1.64152-1.3125h.1482l1.6415 1.3125c.1376.1101.2991.1865.4715.2228.1725.0363.351.0316.5213-.0138.8934-.2368 1.7514-.5908 2.5519-1.0528.1524-.0883.2819-.2112.3782-.3587.0962-.1475.1565-.3156.1759-.4907l.2325-2.0887.104-.1041 2.0897-.239c.1751-.0194.3432-.0797.4907-.1759.1475-.0963.2704-.2258.3587-.3782.4634-.8005.8187-1.6589 1.0566-2.5528.0448-.1699.0493-.3479.013-.5198-.0363-.172-.1124-.333-.2221-.4702l-1.3125-1.6416Zm-2.2612-.4584c.015.256.015.5127 0 .7687-.0168.2784.0704.553.2446.7707l1.2038 1.5047c-.1136.3363-.2492.6648-.406.9834l-1.9153.2128c-.2773.0317-.5329.1654-.7171.375-.1704.1919-.3519.3735-.5438.5438-.2096.1842-.3433.4398-.375.7171l-.2119 1.9144c-.3185.1574-.647.2936-.9834.4078l-1.5047-1.2047c-.1997-.1593-.4477-.2459-.7031-.2456h-.0675c-.2561.015-.5127.015-.7688 0-.2781-.0165-.5525.0703-.7706.2438l-1.50469 1.2047c-.33634-.1137-.66486-.2493-.98343-.406l-.21282-1.9153c-.0317-.2773-.16536-.5329-.375-.7172-.19187-.1703-.37344-.3519-.54375-.5437-.18426-.2097-.43988-.3433-.71718-.375l-1.91438-.2119c-.15734-.3185-.29357-.647-.40781-.9834l1.20375-1.5047c.17424-.2177.26144-.4923.24469-.7707-.01501-.256-.01501-.5127 0-.7687.01675-.2783-.07045-.553-.24469-.77063L3.18781 8.34038c.11364-.33634.24924-.66486.40594-.98343l1.91531-.21281c.27731-.03171.53292-.16537.71719-.375.17031-.19188.35188-.37345.54375-.54375.20964-.18427.3433-.43989.375-.71719l.21188-1.91438c.31852-.15734.64704-.29357.98343-.40781L9.845 4.3907c.2181.17343.4925.26023.7706.24375.2561-.015.5127-.015.7688 0 .2782.01701.5528-.06985.7706-.24375l1.5047-1.20469c.3364.11424.6649.25047.9834.40781l.2128 1.91532c.0317.2773.1654.53292.375.71718.1919.17031.3735.35188.5438.54375.1843.20964.4399.3433.7172.375l1.9143.21188c.1574.31852.2936.64704.4079.98343l-1.2038 1.50469c-.1749.21743-.2628.49203-.2465.77063Z"/></svg>';

interface SettingRow {
	name: string;
	description: string;
	input: 'checkbox' | 'text' | 'number' | 'select';
	settingKey: keyof Settings;
	changeEvent: (evt: Event) => void;
}

const settingsRows = [
	{
		name: 'Disable notifications?',
		description: 'Notification bubbles will not be shown when this is enabled.',
		input: 'checkbox',
		settingKey: 'showPluginNotifications',
		changeEvent: (evt: Event) => {
			if (evt.currentTarget instanceof HTMLInputElement) {
				settings.updateSetting('showPluginNotifications', evt.currentTarget.checked);
			}
		},
	},
	{
		name: 'Verbose logging?',
		description: 'Log additional information to the console.',
		input: 'checkbox',
		settingKey: 'verbose',
		changeEvent: (evt: Event) => {
			if (evt.currentTarget instanceof HTMLInputElement) {
				settings.updateSetting('verbose', evt.currentTarget.checked);
			}
		},
	},
] satisfies SettingRow[];

export default {
	id: 'astro:settings',
	name: 'Overlay settings',
	icon: icon,
	init(canvas) {
		createSettingsWindow();

		document.addEventListener('astro:after-swap', createSettingsWindow);

		function createSettingsWindow() {
			const window = createWindowWithTransition(
				'Settings',
				icon,
				`<style>
					h2, h3 {
						margin-top: 0;
					}

					.setting-row {
						display: flex;
						justify-content: space-between;
						align-items: center;
					}

					h3 {
						font-size: 16px;
						font-weight: 400;
						color: white;
						margin-bottom: 0.25rem;
					}
				</style>
				<h2>General</h2>
				`,
				settingsRows.flatMap((setting) => [
					getElementForSettingAsString(setting),
					document.createElement('hr'),
				])
			);
			canvas.append(window);

			function getElementForSettingAsString(setting: SettingRow) {
				const label = document.createElement('label');
				label.classList.add('setting-row');
				const section = document.createElement('section');
				section.innerHTML = `<h3>${setting.name}</h3>${setting.description}`;
				label.append(section);

				switch (setting.input) {
					case 'checkbox': {
						const astroToggle = document.createElement('astro-dev-overlay-toggle');
						astroToggle.input.addEventListener('change', setting.changeEvent);
						astroToggle.input.checked = settings.config[setting.settingKey];
						label.append(astroToggle);
					}
				}

				return label;
			}
		}
	},
	async beforeTogglingOff(canvas) {
		return await waitForTransition(canvas);
	},
} satisfies DevOverlayPlugin;
