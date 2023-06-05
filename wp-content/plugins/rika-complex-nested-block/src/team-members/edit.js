import { RichText, useBlockProps, MediaPlaceholder, BlockControls, InspectorControls, MediaReplaceFlow, store as blockEditorStore } from "@wordpress/block-editor";
import { isBlobURL, revokeBlobURL } from '@wordpress/blob';
import { useEffect, useRef, useState } from "@wordpress/element";
import { Spinner, withNotices, PanelBody, TextareaControl } from "@wordpress/components";
import { __ } from '@wordpress/i18n'
import { useSelect } from '@wordpress/data'
import { usePrevious } from '@wordpress/compose'
import { ToolbarButton, Icon, TextControl, Button} from "@wordpress/components";
import { SelectControl, Tooltip } from "@wordpress/components";
import {DndContext, useSensor, useSensors, PointerSensor} from '@dnd-kit/core';
import SortableItem from './sortable-item'
import { restrictToHorizontalAxis } from '@dnd-kit/modifiers'
import { SortableContext, horizontalListSortingStrategy, arrayMove } from '@dnd-kit/sortable'
function Edit({attributes, setAttributes, noticeOperations, noticeUI, isSelected}) {
    const {name, bio, id, url, alt, sociallinks} = attributes;
    const [bobURL, setBobURL] = useState();
    const [selectedLink, setSelectedLink] = useState();
    const setChangeName = (myName) => {
        setAttributes({name: myName})
    }
    const prevUrl = usePrevious(url);
    const prevIsSelected = usePrevious(isSelected);
    const titleRef = useRef();
    const setChangeBio = (myBio) => {
        setAttributes({bio: myBio})
    }
    const sensors = useSensors(useSensor(PointerSensor, {
        activationConstraint: {distance: 5}
    }));
    const onChangeImage = (newUrl) => {
        setAttributes({url: newUrl})
    }
    const onSelectImage = (image) => {
        if(!image && !image.url) {
            setAttributes({url: undefined, id: undefined, alt: ''});
            return;
        }
        setAttributes({url: image.url, id: image.id, alt: image.alt})
    }
    const imageObject = useSelect((select) => {
        const { getMedia } = select('core');
        return id ? getMedia(id): null;
    }, [id]);
    const imageSizes = useSelect((select) => {
        return select(blockEditorStore).getSettings().imageSizes;
    }, []);
    function getImageSizeOptions() {
        if(!imageObject) return [];
        const options = []
        const sizes =  imageObject.media_details.sizes;
        for(const key in sizes) {
            const size = sizes[key];
            const imageSize = imageSizes.find(s=> s.slug === key);
            if(imageSize) {
                options.push({
                    label: imageSize.name,
                    value: size.source_url
                })
            }
        }
        return options;
    }
    const onSelectURl = (newURL) => {
        setAttributes({
            url: newURL,
            id: undefined,
            alt:''
        });
    }
    const onUploadError = (message) => {
        noticeOperations.removeAllNotices();
        noticeOperations.createErrorNotice(message);
    }
    const removeUrl = () => {
        setAttributes({
            id: undefined,
            alt: '',
            url: undefined
        })
    }
    const onChangeAlt = (newalt) => {
        setAttributes({alt: newalt})
    }
    const addNewSocialLink = () => {
        setAttributes({
            sociallinks: [ ...sociallinks, {icon: 'wordpress', 'link': ''} ]
        })
        setSelectedLink(sociallinks.length)
    }
    useEffect(() => {
        if(!id && isBlobURL(url)) {
            setAttributes({
                id: undefined,
                alt: ''
            })
        }
    })
    useEffect(() => {
        if(isBlobURL(url)) {
            setBobURL(url);
        } else {
            revokeBlobURL(url);
            setBobURL();
        }
    }, [url]);
    useEffect(() => {
        if(url && !prevUrl && isSelected) {
            titleRef.current.focus();
        }
    }, [url, prevUrl])
    useEffect(() => {
        if(prevIsSelected && !isSelected) {
            setSelectedLink();
        }
    }, [isSelected, prevIsSelected])
    const updateSocialLinkItem = (type, value) => {
        const socialLinkCopy = [ ...sociallinks ]
        socialLinkCopy[selectedLink][type] = value;
        setAttributes({sociallinks: socialLinkCopy})
    }
    const removeItem = () => {
        setAttributes({
            sociallinks: [
                ...sociallinks.slice(0, selectedLink),
                ...sociallinks.slice(selectedLink+1)
            ]
        })
        setSelectedLink()
    }
    const handleDragEnd = (event) => {
        const { active, over } = event;
        if(active && over && active.id !== over.id ) {
            const oldIndex = sociallinks.findIndex((i) => active.id === `${i.icon}-${i.link}`);
            const newIndex = sociallinks.findIndex((i) => over.id === `${i.icon}-${i.link}`);
            setAttributes({
                sociallinks: arrayMove(sociallinks, oldIndex, newIndex)
            })
            setSelectedLink(newIndex)
        }
    }
    return(
        <>
            <InspectorControls>
                <PanelBody title={__('image setting', 'rika')}>
                    { url && !isBlobURL(url) && <TextareaControl label={__('Alt text', 'rika')}
                    value={alt}
                    onChange={onChangeAlt}
                    help={__('enter alt text for this image','rika')}
                    /> }
                    
                    {id &&
                        <SelectControl 
                            label={__('Image Size', 'rika')}
                            options={ getImageSizeOptions() }
                            value={url}
                            onChange={ onChangeImage }
                        />
                    }
                </PanelBody>
            </InspectorControls>
            {url && <BlockControls group="inline">
                <MediaReplaceFlow
                    name={__("Replace Image", "rika")}
                    onSelect={onSelectImage} 
                    onSelectURL={onSelectURl}
                    onError={onUploadError}
                    accept="image/*"
                    allowedTypes={['image']}
                    mediaId={id}
                    mediaURL={url}
                />
                <ToolbarButton onClick={removeUrl}>Remove Image</ToolbarButton>
            </BlockControls> }
            <div { ...useBlockProps() }>
                {url && <div className={`wp-block-blocks-course-team-member-img ${isBlobURL(url) ? 'is-loading': ''}`}>
                    <img src={url} alt={alt} />
                    {isBlobURL(url) && <Spinner/>}
                </div> }
                <MediaPlaceholder icon="admin-users" 
                onSelect={onSelectImage} 
                onSelectURL={onSelectURl}
                onError={onUploadError}
                // accept="image/*"
                disableMediaButtons={url}
                allowedTypes={['image']}
                notices={noticeUI}
                />
                <RichText
                    placeholder={"Team Name"}
                    value={name}
                    tagName="h4"
                    ref={titleRef}
                    onChange={setChangeName}
                    allowedFormats={[]}
                />
                <RichText
                    tagName="p"
                    placeholder={"Team BIO"}
                    value={bio}
                    onChange={setChangeBio}
                    allowedFormats={[]}
                />
                <div className="wp-block-course-social-links">
                    <ul>
                        <DndContext sensors={sensors} onDragEnd={ handleDragEnd }
                        modifiers={[restrictToHorizontalAxis]}
                        >
                            <SortableContext items={sociallinks.map((item) => `${item.icon}-${item.link}`)}
                            strategy={horizontalListSortingStrategy}
                            >
                                {
                                    sociallinks.map((item, index) => {
                                        return(
                                            <SortableItem key={`${item.icon}-${item.link}`} id={`${item.icon}-${item.link}`}
                                                index={index}
                                                selectedLink={selectedLink}
                                                setSelectedLink={setSelectedLink}
                                                icon={item.icon}
                                            />
                                        )
                                    })
                                }
                            </SortableContext>
                        </DndContext>
                        
                        { isSelected && <li className="wp-block-course-team-member-add-icon">
                            <Tooltip text={__('add social link', 'rika')}><button onClick={ addNewSocialLink } aria-label={__('add social link', 'rika')}><Icon icon={'plus'} /></button></Tooltip>
                        </li> }
                    </ul>
                </div>
                { selectedLink !== undefined && (
                <div className="wp-block-course-member-link-form">
                    <TextControl onChange={(icon) => {updateSocialLinkItem('icon', icon)}} value={sociallinks[selectedLink].icon} label={__('Icon', 'rika')}/>
                    <TextControl onChange={(link) => {updateSocialLinkItem('link', link)}} value={sociallinks[selectedLink].link} label={__('URL', 'rika')}/>
                    <br/>
                    <Button onClick={removeItem} isDestructive>
                        {__('Remove Link', 'rika')}
                    </Button>
                </div> )}
            </div>
        </>
    )
}

export default withNotices(Edit);