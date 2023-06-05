import { registerBlockType } from '@wordpress/blocks';
import Edit from './edit';
import Save from './save';
registerBlockType("create-block/team-member", {
    "title": "Rika Team Member",
    "description": "Team member description",
    "icon": "admin-users",
    parent: "create-block/rika-team-members",
    supports: {
        reusable: false,
        html: false
    },
    attributes: {
        name: {
            "type": "string",
            "source": "html",
            "selector": "h4"
        },
        bio: {
            "type": "string",
            "source": "html",
            "selector": "p"
        },
        id: {
            "type": "number",
        },
        alt: {
            "type": "string",
            "source": "attribute",
            "selector": "img",
            "attribute": "alt",
            "default": ""
        },
        url: {
            "type": "string",
            "source": "attribute",
            "selector": "img",
            "attribute": "src"
        },
        sociallinks: {
            type: "array",
            default: [],
            source: 'query',
            attribute: '.wp-block-course-social-links ul li',
            query: {
                icon: {
                    source: 'attribute',
                    attribute: 'data-icon'
                },
                link: {
                    source: 'attribute',
                    selector: 'a',
                    attribute: 'href',
                }
            }
        }
    },
    edit: Edit,
    save: Save
})