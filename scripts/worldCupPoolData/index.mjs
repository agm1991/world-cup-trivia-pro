import { easy1 } from './easy1.mjs';
import { easy2 } from './easy2.mjs';
import { mediumA } from './mediumA.mjs';
import { mediumB } from './mediumB.mjs';
import { hardA } from './hardA.mjs';
import { hardB } from './hardB.mjs';
import { ultimatePool } from './ultimatePool.mjs';

export const easy = [...easy1, ...easy2];
export const medium = [...mediumA, ...mediumB];
export const hard = [...hardA, ...hardB];
export const ultimate = ultimatePool;
