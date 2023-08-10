from dmt.src.fonts.google_fonts import GoogleFontsRepository

google_fonts = GoogleFontsRepository()


def font(familly, weight, service='fonts.google.com'):
    if service == 'fonts.google.com':
        return google_fonts.font(familly, weight)
    else:
        raise Exception('Unsupported font service')
