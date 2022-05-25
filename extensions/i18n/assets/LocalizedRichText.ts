
import * as i18n from './LanguageData';

import { _decorator, Component, Label, RichText } from 'cc';
const { ccclass, property, executeInEditMode } = _decorator;

@ccclass('LocalizedRichText')
@executeInEditMode
export class LocalizedRichText extends Component {
    label: RichText = null!;

    @property
    key: string = '';

    onLoad() {
        if (!i18n.ready) {
            i18n.init('zh');
        }
        this.fetchRender();
    }

    fetchRender () {
        let label = this.getComponent(RichText);
        if (label) {
            this.label = label;
            this.updateLabel();
            return;
        } 
    }

    updateLabel () {
        this.label && (this.label.string = i18n.t(this.key));
    }
}
