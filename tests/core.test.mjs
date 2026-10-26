import test from 'node:test';
import assert from 'node:assert/strict';
import {fields,missing,handoff,setupPrompt,continuationPrompt,examples} from '../site/core.mjs';
test('an incomplete task cannot appear complete',()=>{assert.equal(missing({}).length,6);assert.equal(missing({goal:'  '}).length,6);assert.match(handoff({}),/Not provided/);});
test('every synthetic example produces a complete portable handoff',()=>{for(const ex of Object.values(examples)){assert.deepEqual(missing(ex),[]);for(const k of fields)assert.ok(handoff(ex).includes(ex[k]));}});
test('user content stays literal and is not evaluated',()=>{const text='<script>alert(1)</script> ${process.env.SECRET}';assert.ok(handoff({...examples.bug,goal:text}).includes(text));});
test('setup preserves all task fields and points only to the official setup',()=>{const p=setupPrompt(examples.launch);for(const k of fields)assert.ok(p.includes(examples.launch[k]));assert.match(p,/https:\/\/tokenrip.com\/setup/);assert.match(p,/Do not do the next action yet/);});
test('continuation requires the actual record and preserves work authority',()=>{assert.match(continuationPrompt(),/latest Task handoff/);assert.match(continuationPrompt(),/within my authorization/);assert.match(continuationPrompt(),/actually read the saved record/);});
