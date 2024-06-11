module.exports = {
	// generate random string
	generateRandomString() {
		let text = '';
		const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

		for (let i = 0; i < 6; i += 1) {
			text += possible.charAt(Math.floor(Math.random() * possible.length));
		}
		return text;
	},

	isNullOrEmpty(...args) {

		let temp = args[0]

		if (temp === undefined || temp === null || temp === '') {
			return true
		}

		if (typeof temp === 'string') {
			if (temp === undefined || temp === null || temp.trim() === '') {
				return true
			}

			return false
		}

		if (typeof temp === 'object' && !Array.isArray(temp)) {
			let variable = args[1]

			for (let i = 0; i < variable.length; i++) {
				if (temp[variable[i]] === undefined || temp[variable[i]] === null || temp[variable[i]] === '') {
					return true;
				}
			}

			return false;

		}

		if (typeof temp === 'object' && Array.isArray(temp)) {
			let variable = args[1]

			for (let t = 0; t < temp.length; t++) {
				for (let i = 0; i < variable.length; i++) {
					if (temp[t][variable[i]] === undefined || temp[t][variable[i]] === null || temp[t][variable[i]] === '') {
						return true;
					}
				}
			}

			return false;

		}

		return true
	}
};
