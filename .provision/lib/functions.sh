# highlight step messages
function echo_c() {
    echo -e "\e[35m==> ${1}\e[0m"
}

# format duration
function format_duration() {
    ((h=${1}/3600))
    ((m=(${1}%3600)/60))
    ((s=${1}%60))
    printf "%02d:%02d:%02d\n" $h $m $s
}
