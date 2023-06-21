export class ComponentBase extends HTMLElement {
    template = '';

    initTemplate() {
        this.attachShadow({ mode: "open" });
        const template = document.createElement('template');
        const wrapper = document.createElement('div');
        wrapper.insertAdjacentHTML('beforeend', this.template);
        template.content.append(wrapper);
        this.shadowRoot?.append(template.content.cloneNode(true));
    }
}