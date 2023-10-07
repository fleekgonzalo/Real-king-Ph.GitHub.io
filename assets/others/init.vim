set nu
set ts=3
set sw=3
set mouse=a
set cindent
set hls
set expandtab
packadd termdebug

map C ggvG"+y<CR>
map S :w<CR>
map Q :q<CR>

inoremap { {}<LEFT>
inoremap ' ''<LEFT>
inoremap " ""<LEFT>
inoremap ( ()<LEFT>
inoremap [ []<LEFT>

call plug#begin()

Plug 'morhetz/gruvbox'
Plug 'octol/vim-cpp-enhanced-highlight'
Plug 'vim-airline/vim-airline'
Plug 'dense-analysis/ale'
Plug 'luochen1990/rainbow'
Plug 'mhinz/vim-startify'

Plug 'godlygeek/tabular'
Plug 'preservim/vim-markdown'

Plug 'iamcco/markdown-preview.nvim', { 'do': { -> mkdp#util#install() }, 'for': ['markdown', 'vim-plug']}

call plug#end()

set laststatus=2

let g:gruvbox_contrast_dark='hard'
let g:airline_theme='gruvbox'
set background=dark
colorscheme gruvbox

let g:ale_linters={'cpp':['g++'],'c':['gcc']}

let g:ale_c_gcc_options='-Wall -O2 -std=c99'
let g:ale_cpp_gcc_options='-Wall -O2 -std=c++17'

let g:ale_cpp_std='c++17'
let g:ale_cpp_cc_options='-std=c++17'

let g:ale_sign_error = '🥵'
let g:ale_sign_warning = '⚡'
let g:ale_statusline_format = ['🥵 %d', '⚡  %d', '✔ OK'] 

let g:rainbow_active = 1

map <F5> :call CompileRunGcc()<CR>

func! CompileRunGcc()
    exec "w" 
    if &filetype == 'c' 
        exec '!g++ % -o %< -DDEBUG'
        exec '!./%<'
    elseif &filetype == 'cpp'
        exec '!g++ % -o %< -DDEBUG -std=c++17'
        exec '!./%< < data.in > data.out'
        exec '!cat data.out'
    elseif &filetype == 'python'
        exec '!python %'
    elseif &filetype == 'sh'
        :!time bash %
    endif                                                                              
endfunc

let g:vim_markdown_math = 1


