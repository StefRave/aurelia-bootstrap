var _dec, _dec2, _class, _desc, _value, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _descriptor14;

function _initDefineProp(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
        enumerable: descriptor.enumerable,
        configurable: descriptor.configurable,
        writable: descriptor.writable,
        value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
}

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
        desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
        desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
        return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
        desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
        desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
        Object['define' + 'Property'](target, property, desc);
        desc = null;
    }

    return desc;
}

function _initializerWarningHelper(descriptor, context) {
    throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
}

import { inject, bindable, bindingMode, observable, BindingEngine } from 'aurelia-framework';
import { bootstrapOptions } from "../utils/bootstrap-options";

export let AubsTypeaheadCustomElement = (_dec = inject(BindingEngine), _dec2 = bindable({ defaultBindingMode: bindingMode.twoWay }), _dec(_class = (_class2 = class AubsTypeaheadCustomElement {

    constructor(bindingEngine) {
        _initDefineProp(this, 'value', _descriptor, this);

        _initDefineProp(this, 'data', _descriptor2, this);

        _initDefineProp(this, 'openOnFocus', _descriptor3, this);

        _initDefineProp(this, 'resultsLimit', _descriptor4, this);

        _initDefineProp(this, 'focusFirst', _descriptor5, this);

        _initDefineProp(this, 'loadingText', _descriptor6, this);

        _initDefineProp(this, 'inputClass', _descriptor7, this);

        _initDefineProp(this, 'placeholder', _descriptor8, this);

        _initDefineProp(this, 'key', _descriptor9, this);

        _initDefineProp(this, 'noResultsText', _descriptor10, this);

        _initDefineProp(this, 'waitTime', _descriptor11, this);

        _initDefineProp(this, 'instantCleanEmpty', _descriptor12, this);

        _initDefineProp(this, 'customEntry', _descriptor13, this);

        this.v4 = false;
        this.displayData = [];

        _initDefineProp(this, 'filter', _descriptor14, this);

        this.focusedIndex = -1;
        this.loading = false;

        this.bindingEngine = bindingEngine;

        this.openListener = () => this.openDropdown();
        this.outsideClickListener = evt => this.handleBlur(evt);
        this.keyDownListener = evt => this.onKeyDown(evt);
    }

    bind() {
        if (bootstrapOptions.version === 4) {
            this.v4 = true;
        }

        if (Array.isArray(this.data)) {
            this.dataObserver = this.bindingEngine.collectionObserver(this.data).subscribe(() => {
                this.checkCustomEntry();
                this.applyPlugins();
            });
        }

        this.checkCustomEntry();
    }

    attached() {
        if (this.openOnFocus) {
            this.input.addEventListener('focus', this.openListener);
            this.input.addEventListener('click', this.openListener);
        }

        document.addEventListener('click', this.outsideClickListener);
        this.input.addEventListener('keydown', this.keyDownListener);

        this.applyPlugins();
    }

    detached() {
        if (this.dataObserver) {
            this.dataObserver.dispose();
        }

        document.removeEventListener('click', this.outsideClickListener);
        this.input.removeEventListener('keydown', this.keyDownListener);

        if (this.openOnFocus) {
            this.input.removeEventListener('focus', this.openListener);
            this.input.removeEventListener('click', this.openListener);
        }
    }

    openDropdown() {
        this.doFocusFirst();
        this.dropdown.classList.add('open');
    }

    doFocusFirst() {
        if (this.focusFirst && this.displayData.length > 0) {
            this.displayData[0].$focused = true;
            this.focusedIndex = 0;
        }
    }

    checkCustomEntry() {
        if (this.data.length > 0 && typeof this.data[0] === 'object') {
            this.customEntry = false;
        }
    }

    filterChanged() {
        this.focusNone();
        this.applyPlugins();

        if (this.instantCleanEmpty && this.filter.length == 0) {
            this.value = undefined;
        } else if (this.customEntry) {
            this.value = this.filter;
        }
    }

    applyPlugins() {
        let localData;

        if (typeof this.data === 'function') {
            this.loading = true;

            return this.data({ filter: this.filter, limit: this.resultsLimit }).then(data => {
                this.displayData = data;
                this.doFocusFirst();
            }).catch(() => {
                this.displayData = [];
                throw new Error('Unable to retrieve data');
            }).finally(() => this.loading = false);
        } else {
            localData = [].concat(this.data);
            if (this.filter && this.filter.length > 0) {
                localData = this.doFilter(localData);
            }

            if (!this.isNull(this.resultsLimit) && !isNaN(this.resultsLimit)) {
                localData = localData.slice(0, this.resultsLimit);
            }

            this.displayData = localData;
            this.doFocusFirst();
        }
    }

    focusNone() {
        let focused = this.displayData.find(next => next.$focused);
        if (focused) {
            focused.$focused = false;
        }

        this.focusedIndex = -1;
    }

    doFilter(toFilter) {
        return toFilter.filter(item => !this.isNull(item) && this.getName(item).toLowerCase().indexOf(this.filter.toLowerCase()) > -1);
    }

    getName(item) {
        if (typeof item === 'object') {
            return item[this.key].toString();
        }

        return item.toString();
    }

    resetFilter() {
        if (this.filter.length === 0) {
            this.value = undefined;
        }

        if (this.isNull(this.value)) {
            this.filter = '';
        } else {
            this.filter = this.getName(this.value);
        }
    }

    handleBlur(evt) {
        if (!this.dropdown.classList.contains('open')) {
            return;
        }

        if (!this.dropdown.contains(evt.target)) {
            this.dropdown.classList.remove('open');
            this.focusNone();
            this.resetFilter();
        }
    }

    itemSelected(item) {
        this.value = item;
        this.dropdown.classList.remove('open');
        this.filter = this.getName(this.value);
    }

    isNull(item) {
        return item === null || item === undefined;
    }

    onKeyDown(evt) {
        this.dropdown.classList.add('open');

        switch (evt.keyCode) {
            case 40:
                return this.handleDown();
            case 38:
                return this.handleUp();
            case 13:
            case 9:
                return this.handleEnter();
            case 27:
                return this.handleScape();
        }
    }

    handleDown() {
        if (this.focusedIndex >= this.displayData.length - 1) {
            return;
        }

        if (this.focusedIndex >= 0) {
            this.displayData[this.focusedIndex].$focused = false;
        }
        this.displayData[++this.focusedIndex].$focused = true;
    }

    handleUp() {
        if (this.focusedIndex === 0) {
            return;
        }

        this.displayData[this.focusedIndex--].$focused = false;
        this.displayData[this.focusedIndex].$focused = true;
    }

    handleEnter() {
        if (this.displayData.length === 0 || this.focusedIndex < 0) {
            return;
        }

        this.itemSelected(this.displayData[this.focusedIndex]);
    }

    handleScape() {
        this.dropdown.classList.remove('open');
        this.focusNone();
        this.resetFilter();
    }
}, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'value', [_dec2], {
    enumerable: true,
    initializer: null
}), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'data', [bindable], {
    enumerable: true,
    initializer: null
}), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, 'openOnFocus', [bindable], {
    enumerable: true,
    initializer: function () {
        return false;
    }
}), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, 'resultsLimit', [bindable], {
    enumerable: true,
    initializer: null
}), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, 'focusFirst', [bindable], {
    enumerable: true,
    initializer: function () {
        return true;
    }
}), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, 'loadingText', [bindable], {
    enumerable: true,
    initializer: function () {
        return 'Loading...';
    }
}), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, 'inputClass', [bindable], {
    enumerable: true,
    initializer: function () {
        return '';
    }
}), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, 'placeholder', [bindable], {
    enumerable: true,
    initializer: function () {
        return 'Start typing to get results';
    }
}), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, 'key', [bindable], {
    enumerable: true,
    initializer: function () {
        return 'name';
    }
}), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, 'noResultsText', [bindable], {
    enumerable: true,
    initializer: function () {
        return 'No Results';
    }
}), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, 'waitTime', [bindable], {
    enumerable: true,
    initializer: function () {
        return 350;
    }
}), _descriptor12 = _applyDecoratedDescriptor(_class2.prototype, 'instantCleanEmpty', [bindable], {
    enumerable: true,
    initializer: function () {
        return true;
    }
}), _descriptor13 = _applyDecoratedDescriptor(_class2.prototype, 'customEntry', [bindable], {
    enumerable: true,
    initializer: function () {
        return false;
    }
}), _descriptor14 = _applyDecoratedDescriptor(_class2.prototype, 'filter', [observable], {
    enumerable: true,
    initializer: function () {
        return '';
    }
})), _class2)) || _class);