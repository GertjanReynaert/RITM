// #!/usr/bin/env node

import { safeReadJson } from './fileReader';

const RITMConfig = safeReadJson('./package.json').RITM;

console.log(RITMConfig.translationsDirectory);
