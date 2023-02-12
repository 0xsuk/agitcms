# Frontmatter Editor
## What is Frontmatter
Frontmatter (or front matter?) is a metadata notation for markdown. 

It is placed at the top of markdown file, and wrapped by delimiter characters (default: `---`) to denote its frontmatter.

It follows same syntax as yaml or toml, which are configuration language that consists of key-value pair.  

Delimiters, and which syntax to use (yaml/toml) can be customized in [settings](https://github.com/0xsuk/agitcms/edit/main/Settings.md#delimiters)  

## Type-awareness
Agit CMS by default automatically reads frontmatter value, and infers its data type to provide type-aware editor.

Visit [here](/Settings.md#template) to see what data types Agit CMS supports.

You can configure Agit CMS to use specific data type for a certain frontmatter property. Visit [here](/Settings.md#template) again.

## Default value
There are three way to set default frontmatter value.

1. Use Agit CMS: [here](/Settings.md#template)
2. Use static site generator's feature: Hugo, for instance, reads [archtype file](https://gohugo.io/content-management/archetypes/) when creating new posts, and it inserts default frontmatter.
3. Use terminal: Probably the most simplest solution and this is the advantage of having access to filesystem. Write a shell script. Bash, Python, whatever works.
 This is just an example but you can place a frontmatter.txt containing default frontmatter somewhere in your system and run `cp frontmatter.txt newpost.md` (in Unix for example) to create new posts.

## Using frontmatter editor

Clicking `NEW File` in file explorer with frontmatter-template being set inserts default frontmatter at the top of the markdown file. It's not visible in markdown tab though.

Things to note
- Changes are directly written to filesystem automatically.

Can I view frontmatter in raw format?
- You can `cat post.md | head -n 20` in terminal for example.


screenshots
![](https://github.com/0xsuk/agitcms/blob/main/github/localhost_3131_6.png)
![](https://github.com/0xsuk/agitcms/blob/main/github/localhost_3131_7.png)
