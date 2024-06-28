async def stream_model(generator_func, model_name):
    yield '['
    first = True
    try:
        for line in generator_func(model_name=model_name):
            if not first:
                yield ','
            first = False
            yield line
            print(line)
        yield ']'
    except Exception as e:
        error_message = f'{{"error": "{str(e)}"}}'
        yield error_message
        print(error_message)
