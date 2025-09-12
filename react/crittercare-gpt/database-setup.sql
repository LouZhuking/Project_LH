-- 创建向量扩展（如果还没有的话）
CREATE EXTENSION IF NOT EXISTS vector;

-- 创建存储知识块的表
CREATE TABLE IF NOT EXISTS chunks (
    id BIGSERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    vector vector (1536),
    url TEXT,
    created_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT NOW()
);

-- 创建向量相似度搜索的函数
CREATE OR REPLACE FUNCTION match_chunks(
  query_embedding vector(1536),
  match_threshold float,
  match_count int
)
RETURNS TABLE (
  id bigint,
  content text,
  url text,
  similarity float
)
LANGUAGE SQL STABLE
AS $$
  SELECT 
    chunks.id,
    chunks.content,
    chunks.url,
    1 - (chunks.vector <=> query_embedding) AS similarity
  FROM chunks
  WHERE 1 - (chunks.vector <=> query_embedding) > match_threshold
  ORDER BY chunks.vector <=> query_embedding
  LIMIT match_count;
$$;

-- 创建向量索引以提高搜索性能
CREATE INDEX IF NOT EXISTS chunks_vector_idx ON chunks USING ivfflat (vector vector_cosine_ops)
WITH (lists = 100);