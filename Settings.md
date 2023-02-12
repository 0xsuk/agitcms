# Global Settings
Navigate to home. Click on settings. Tweak as you wish.  

# Site Settings
Site specific settings.

Navigate to one of your site in Agit, then click Settings in the sidebar.


## Frontmatter
### Delimiters
Default: "---". Delimiters is what surrounds frontmatter.
### Language
Default: "yaml". another options is "toml"
### Template
Specifies type, property name, default value of each frontmatter.  (you can grab = to change the order)  

Agit parses frontmatter and provides type-aware editor using this information.

| type | examplme in yaml |
| --- | --- |
| Text | this is text
| List of Text | - Web Dev<br>- React.js<br>- Node.js 
| Multiline Text | text with <br>multiple lines |
| Date (in ISO 8601 format) | 2022-01-01
| Bool | true
| Nest (property that contains child properties) |  |

Things to note
- No number type: just use text
- No image type: it's just a path to image. It's a text. I switch to Media tab to copy whatever image path, then paste it into text field.   
- No list of Date, Bool: Nobody needs it, I guess

## Media
- Media Folder Path: Filesystem path to the folder that contains all the media contents. Only used in media tab to figure out the root folder of media contents.  
This does not have to match "static" folder of your static site generator. In many cases static folder contains not only media contents, but also javascript files, etc.
What you want to see in media tab is just media contents, so it is good idea to create a new folder in static folder and let it be media folder.
- Media Public Path: 
If your static folder matches media folder path, media public path is useless.
In media tab, clicking `COPY` gives `${media public path}/${media file path relative to Media Folder Path}`.  

Let's see an example.  
1. In Hugo, files under [static](https://gohugo.io/content-management/static-files/) folder
are served by `${Your website's URL}/${file}`, where `${file}` is path relative to static folder.  
Let's say file in question is `${static folder}/uploads/image.png`, so `${file}` is uploads/image.png (relative to static).  
2. You set media folder path to `${static folder}/uploads`, because `uploads` is the directory that contains media contents.
3. In media tab, clicking `COPY` gives `image.png` because Media Public Path is empty. This is not good.
4. because what you should write in markdown file is `![image](/uploads/image.png)`, NOT `![image](image.png)`. So `COPY` should give the former.
5. Set Media Public Path to `/uploads`, then `COPY` gives `/uploads/image.png`.


screenshot
![](https://github.com/0xsuk/agitcms/blob/main/github/localhost_3131_3.png)
![](https://github.com/0xsuk/agitcms/blob/main/github/localhost_3131_4.png)

