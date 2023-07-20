import subprocess
import re


def load_google_fonts():
    """
    Download the google fonts via
    `git clone https://github.com/google/fonts.git`
    """
    subprocess.run(['git', 'clone', 'https://github.com/google/fonts.git'])


def fallback(text):
    """
    Fallback font
    """
    # if Korean - [ㄱ-ㅎ|ㅏ-ㅣ|가-힣] - use Noto Sans KR
    contains_korean = re.search(r'[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]', text)
    if contains_korean:
        return 'NotoSansKR-Black.otf'

    return False
