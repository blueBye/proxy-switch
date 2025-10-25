#!/usr/bin/env node

import { mainMenu } from './ui.js';

mainMenu().catch(err => console.error('Error:', err instanceof Error ? err.message : String(err)));