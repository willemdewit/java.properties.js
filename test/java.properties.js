var test = require('tape');
var pToO = require('../dist/cjs/java.properties').default;

test('it should default to empty object', (assert) => {
    assert.deepEqual(pToO(''), {}, 'It defaults to returning an empty object');

    assert.end();
});

test('should fail when argument is not a string', (assert) => {
    assert.throws(() => pToO({}), 'Cannot parse java-properties when it is not a string');
    assert.throws(() => pToO(null), 'Cannot parse java-properties when it is not a string');
    assert.throws(() => pToO(123), 'Cannot parse java-properties when it is not a string');

    assert.end();
});

test('it should add single key values', (assert) => {
    assert.deepEqual(pToO('test=value'), { test: 'value' }, 'Without spaces');
    assert.deepEqual(pToO('test:value'), { test: 'value' }, 'Without spaces with colon as separator');
    assert.deepEqual(pToO('test = value'), { test: 'value' }, 'With spaces');
    assert.deepEqual(pToO('    test = value'), { test: 'value' }, 'White-space at begin is ignored');
    assert.deepEqual(pToO(' test         = value'), { test: 'value' }, 'With tabs');
    assert.deepEqual(pToO('test=value '), { test: 'value ' }, 'White space following the property value is not ignored, and is treated as part of the property value.');

    assert.end();
});

test('it should parse multiple properties by line ending', (assert) => {
    assert.deepEqual(pToO('key1=value1\n key2=value2'), { key1: 'value1', key2: 'value2'});
    assert.deepEqual(pToO(`key1=value1
        key2=value2`), { key1: 'value1', key2: 'value2'}, 'Template string');

    assert.end();
});

test('it should parse nested paths', (assert) => {
    assert.deepEqual(pToO('nested.key = value'), { nested: { key: 'value' }});

    assert.end();
});

test('it should skip comment lines', (assert) => {
    assert.deepEqual(pToO('#this is a comment'), {});
    assert.deepEqual(pToO('!this is also a comment'), {});
    assert.deepEqual(pToO('key1 = value1 with # in it'), { key1: 'value1 with # in it' }, 'Should only skip lines starting with #');
    assert.deepEqual(pToO('  #comment prefixed with spaces'), {}, 'Should accept spaces in front');

    assert.end();
});

test('it should be able to parse multi-line values', (assert) => {
    assert.deepEqual(pToO('key1 = this is a value \\\n spanning multiple lines'), { key1: 'this is a value spanning multiple lines'});
    assert.deepEqual(pToO('withBackslash=value with \\\ backslash'), { withBackslash: `value with \\ backslash` }, 'Backslash should be escaped');

    assert.end();
});