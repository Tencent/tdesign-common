import { describe, expect, it } from 'vitest';
import TreeStore from '../../../js/tree/tree-store';

const modes = ['all', 'parentFirst', 'onlyLeaf'] as const;
const scopes = ['all', 'onlyEnabled'] as const;
const data = [{ value: 'P', children: [{ value: 'A' }, { value: 'B' }, { value: 'D', disabled: true }] }];

describe('tree checkAllAffectedBy', () => {
  scopes.forEach((checkAllAffectedBy) => {
    it.each(['all', 'parentFirst'] as const)(
      `${checkAllAffectedBy} preserves an unloaded parent selection across scope changes in %s mode`,
      (valueMode) => {
        const tree = new TreeStore({ checkable: true, valueMode, checkAllAffectedBy });
        tree.append([
          { value: 'P', children: true },
          { value: 'U', children: true },
        ]);
        tree.setChecked(['P']);
        const otherScope = checkAllAffectedBy === 'all' ? 'onlyEnabled' : 'all';
        ([otherScope, checkAllAffectedBy] as const).forEach((scope) => {
          tree.setConfig({ checkAllAffectedBy: scope });
          expect(tree.getChecked()).toEqual(['P']);
          expect(tree.getNode('P').checked).toBe(true);
          expect(tree.getNode('U').checked).toBe(false);
        });
        tree.getNode('P').append([{ value: 'A' }]);
        expect(tree.getNode('A').checked).toBe(true);
        expect(tree.getNode('P').checked).toBe(true);
        expect(tree.getNode('P').indeterminate).toBe(false);
      }
    );

    it.each(modes)(`${checkAllAffectedBy} computes the parent from child states in %s mode`, (valueMode) => {
      const tree = new TreeStore({ checkable: true, valueMode, checkAllAffectedBy });
      tree.append(data);
      const parent = tree.getNode('P');
      tree.setChecked(['A', 'B']);
      expect(parent.checked).toBe(checkAllAffectedBy === 'onlyEnabled');
      expect(parent.indeterminate).toBe(checkAllAffectedBy === 'all');
      expect(tree.getNode('D').checked).toBe(false);
      tree.replaceChecked(parent.toggleChecked());
      expect(tree.getChecked()).toEqual([]);
      expect(parent.checked).toBe(false);
      expect(parent.indeterminate).toBe(false);
    });

    it.each(modes)(
      `${checkAllAffectedBy} preserves disabled selections after parent cancellation in %s mode`,
      (valueMode) => {
        const tree = new TreeStore({ checkable: true, valueMode, checkAllAffectedBy });
        tree.append(data);
        tree.setChecked(['D']);
        const parent = tree.getNode('P');
        expect(parent.indeterminate).toBe(checkAllAffectedBy === 'all');
        tree.replaceChecked(parent.toggleChecked());
        expect(parent.checked).toBe(true);
        tree.replaceChecked(parent.toggleChecked());
        expect(tree.getChecked()).toEqual(['D']);
        expect(tree.getNode('D').checked).toBe(true);
        expect(parent.indeterminate).toBe(checkAllAffectedBy === 'all');
      }
    );
  });

  it.each(modes)('invalidates cached parent states when switching the scope in %s mode', (valueMode) => {
    const tree = new TreeStore({ checkable: true, valueMode, checkAllAffectedBy: 'onlyEnabled' });
    tree.append(data);
    tree.setChecked(['A', 'B']);
    const parent = tree.getNode('P');
    expect(parent.checked).toBe(true);
    tree.setConfig({ checkAllAffectedBy: 'all' });
    expect(parent.checked).toBe(false);
    expect(parent.indeterminate).toBe(true);
    expect(tree.getChecked()).toEqual(['A', 'B']);
    tree.setConfig({ checkAllAffectedBy: 'onlyEnabled' });
    expect(parent.checked).toBe(true);
    expect(parent.indeterminate).toBe(false);
    expect(tree.getNode('D').checked).toBe(false);
  });

  it('preserves the existing default for consumers that do not pass the new option', () => {
    const tree = new TreeStore({ checkable: true });
    tree.append(data);
    tree.setChecked(['A', 'B']);
    expect(tree.getNode('P').checked).toBe(true);
  });

  it.each(['all', 'parentFirst'] as const)(
    'recalculates loaded ancestors while preserving their selected unloaded child in %s mode',
    (valueMode) => {
      const tree = new TreeStore({ checkable: true, valueMode, checkAllAffectedBy: 'onlyEnabled' });
      tree.append([
        {
          value: 'G',
          children: [
            { value: 'P', children: true },
            { value: 'D', disabled: true },
          ],
        },
      ]);
      tree.setChecked(['P']);
      expect(tree.getNode('G').checked).toBe(true);
      tree.setConfig({ checkAllAffectedBy: 'all' });
      expect(tree.getChecked()).toEqual(['P']);
      expect(tree.getNode('P').checked).toBe(true);
      expect(tree.getNode('G').checked).toBe(false);
      expect(tree.getNode('G').indeterminate).toBe(true);
      tree.setConfig({ checkAllAffectedBy: 'onlyEnabled' });
      expect(tree.getNode('P').checked).toBe(true);
      expect(tree.getNode('G').checked).toBe(true);
      expect(tree.getNode('G').indeterminate).toBe(false);
    }
  );
});
