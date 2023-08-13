import re


def fallback(text):
    """
    Fallback font
    """
    # if Korean - [ㄱ-ㅎ|ㅏ-ㅣ|가-힣] - use Noto Sans KR
    contains_korean = re.search(r'[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]', text)
    if contains_korean:
        return 'NotoSansKR-Black.otf'

    return False
